import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TermiiService } from '@on/services/termii/service';

import { RoleModule } from '../role/role.module';

import { Application, ApplicationSchema } from './model/application.model';
import { Card, CardSchema } from './model/card.model';
import { Customer, CustomerSchema } from './model/customer.model';
import { Employment, EmploymentSchema } from './model/employment.model';
import { Repayment, RepaymentSchema } from './model/repayment.model';
import { Token, TokenSchema } from './model/token.model';
import { User, UserSchema } from './model/user.model';
import { Verification, VerificationSchema } from './model/verification.model';
import { ApplicationRepository } from './repository/application.repository';
import { CardRepository } from './repository/card.repository';
import { CustomerRepository } from './repository/customer.repository';
import { EmploymentRepository } from './repository/employment.repository';
import { RepaymentRepository } from './repository/repayment.repository';
import { TokenRepository } from './repository/token.repository';
import { UserRepository } from './repository/user.repository';
import { VerificationRepository } from './repository/verification.repository';
import { UserSeeder } from './seeder/seeder';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Card.name, schema: CardSchema },
      { name: Token.name, schema: TokenSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Repayment.name, schema: RepaymentSchema },
      { name: Employment.name, schema: EmploymentSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: Verification.name, schema: VerificationSchema },
    ]),
    RoleModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserSeeder,
    UserRepository,
    TokenRepository,
    TermiiService,
    CardRepository,
    CustomerRepository,
    RepaymentRepository,
    EmploymentRepository,
    ApplicationRepository,
    VerificationRepository,
  ],
  exports: [
    UserService,
    UserRepository,
    TokenRepository,
    CardRepository,
    CustomerRepository,
    RepaymentRepository,
    EmploymentRepository,
    ApplicationRepository,
    VerificationRepository,
  ],
})
export class UserModule {}
