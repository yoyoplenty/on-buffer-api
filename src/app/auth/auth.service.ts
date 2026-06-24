import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientSession } from 'mongoose';

import { TokenType, UserStatus } from '@on/enum';
import { compareResource, hashResource } from '@on/helpers/password';
import { DatabaseService } from '@on/services/db';
import { ServiceResponse } from '@on/utils/types';

import { RoleRepository } from '../role/repository/role.repository';
import { SharedService } from '../shared/shared.service';
import { Application } from '../user/model/application.model';
import { Customer } from '../user/model/customer.model';
import { User } from '../user/model/user.model';
import { ApplicationRepository } from '../user/repository/application.repository';
import { CardRepository } from '../user/repository/card.repository';
import { CustomerRepository } from '../user/repository/customer.repository';
import { EmploymentRepository } from '../user/repository/employment.repository';
import { RepaymentRepository } from '../user/repository/repayment.repository';
import { TokenRepository } from '../user/repository/token.repository';
import { UserRepository } from '../user/repository/user.repository';
import { VerificationRepository } from '../user/repository/verification.repository';
import { ApplicationStatus } from '../user/types/application.interface';
import { RepaymentMethod } from '../user/types/repayment.interface';
import { OnboardingStep } from '../user/types/user.interface';

import { UserService } from './../user/user.service';
import { LoginDto, ResetPinDto, SharedAuthDto } from './dto/auth.dto';
import { OnboardingDto } from './dto/onboarding.dto';
import { IUserToken } from './types/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly db: DatabaseService,
    private readonly role: RoleRepository,
    private readonly card: CardRepository,
    private readonly user: UserRepository,
    private readonly shared: SharedService,
    private readonly token: TokenRepository,
    private readonly userService: UserService,
    private readonly customer: CustomerRepository,
    private readonly repayment: RepaymentRepository,
    private readonly employment: EmploymentRepository,
    private readonly application: ApplicationRepository,
    private readonly verification: VerificationRepository,
  ) {}

  public async signin(payload: LoginDto): Promise<ServiceResponse<IUserToken>> {
    const { phone, pin } = payload;

    const user = await this.user.findOne({ phone });
    if (!user) throw new NotFoundException('User with this phone number does not exist.');

    if (!user.pin) throw new BadRequestException('User pin not set');
    if (!user.phoneVerified) throw new BadRequestException('Phone number not verified');
    if (user.status === UserStatus.INACTIVE) throw new BadRequestException('Account in inactive');

    const isValidPin: boolean = await compareResource(pin, user.pin);
    if (!isValidPin) throw new BadRequestException('Incorrect pin provided');

    const jwt = this.jwt.sign({ ...user.toJSON() });

    const data = {
      user,
      token: jwt,
    };

    return { data, message: 'User login successfully.' };
  }

  public async onboard(payload: OnboardingDto): Promise<ServiceResponse<User>> {
    const role = await this.role.findOne({ name: 'user' });
    if (!role) throw new BadRequestException('Default user role not found');

    return this.db.transaction(async (session: ClientSession) => {
      const { personalDto, pin, employmentDto, verificationDto, repaymentDto, cardDto } = payload;

      const { repaymentMethod } = repaymentDto;

      const { phone, ...otherPersonal } = personalDto;

      this.logger.log(`Onboarding process has started for, ${phone}`);

      let user = await this.user.findOne({ phone }, { session });
      if (!user) {
        const hashedPin = await hashResource(pin);

        const userPayload = {
          phone,
          pin: hashedPin,
          roleId: role._id,
        };

        user = await this.user.create(userPayload, { session });
      } else {
        if (user.onboardingStep === OnboardingStep.COMPLETED)
          throw new ConflictException('User already completed onboarding');
      }

      let customer: Customer | null = await this.customer.findOne({ userId: user._id }, { session });

      if (customer) customer = await this.customer.updateOne({ userId: user._id }, { ...otherPersonal }, { session });
      else customer = await this.customer.create({ userId: user._id, ...otherPersonal }, { session });

      await this.employment.findOneAndUpdate(
        { userId: user._id },
        { userId: user._id, customerId: customer?._id, ...employmentDto },
        { upsert: true, returnDocument: 'after', session },
      );

      await this.verification.findOneAndUpdate(
        { userId: user._id },
        { userId: user._id, customerId: customer?._id, ...verificationDto },
        { upsert: true, returnDocument: 'after', session },
      );

      const repayment = await this.repayment.findOneAndUpdate(
        { userId: user._id },
        { userId: user._id, customerId: customer?._id, ...repaymentDto },
        { upsert: true, returnDocument: 'after', session },
      );

      if (repaymentMethod === RepaymentMethod.CARD && cardDto) {
        await this.card.create(
          {
            userId: user._id,
            customerId: customer?._id,
            repaymentId: repayment?._id,
            last4: '',
            brand: '',
            isDefault: true,
            token: '',
            ...cardDto,
          },
          { session },
        );
      }

      const applicationId = await this.shared.generateSequentialId('application_id', 'APP', 5);

      const application: Application | null = await this.application.findOneAndUpdate(
        { userId: user._id },
        {
          $set: { status: ApplicationStatus.IN_PROGRESS, currentStep: OnboardingStep.PERSONAL },
          $setOnInsert: { applicationId, userId: user._id },
        },
        { upsert: true, returnDocument: 'after', session },
      );

      user = await this.user.updateById(
        user._id,
        { onboardingStep: OnboardingStep.COMPLETED, status: 'active' },
        { session },
      );

      await this.application.updateOne(
        { _id: application?._id },
        { status: ApplicationStatus.SUBMITTED, submittedAt: new Date() },
        { session },
      );

      this.logger.log(`Onboarding process has completed for, ${phone}`);

      return { data: user, message: 'User oboarded successfully.' };
    });
  }

  public async forgetPin(payload: SharedAuthDto): Promise<ServiceResponse<any>> {
    const { phone } = payload;

    const user = await this.user.findOne({ phone });
    if (!user) throw new NotFoundException('User with this phone number does not exist.');
    if (!user.phoneVerified) throw new BadRequestException('Phone number not verified');

    const otp = await this.userService.createVerificationOtp(user, TokenType.PIN_RESET);

    const data = {
      user_id: user._id,
      otp,
    };

    return { data, message: 'OTP sent for Pin reset.' };
  }

  public async resetPin(payload: ResetPinDto): Promise<ServiceResponse<IUserToken>> {
    const { phone, pin, otp } = payload;

    const user = await this.user.findOne({ phone });
    if (!user) throw new NotFoundException('User with this phone number does not exist.');

    const token = await this.token.findOne({ type: TokenType.PIN_RESET, token: otp });
    if (!token) throw new BadRequestException('Invalid OTP code.');

    if (String(token.user_id) !== String(user._id)) throw new BadRequestException('Invalid user OTP.');
    if (token.expires_at < new Date()) throw new BadRequestException('OTP has expired. Please request a new one.');

    const hashPin = await hashResource(pin);

    await this.user.updateById(user._id, { pin: hashPin });
    await token.deleteOne();

    const jwt = this.jwt.sign(user.toJSON());

    const data = {
      user,
      token: jwt,
    };

    return { data, message: 'Password reset successfully.' };
  }
}
