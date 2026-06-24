import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { RoleRepository } from '@on/app/role/repository/role.repository';
import { UserStatus } from '@on/enum';
import { hashResource } from '@on/helpers/password';

import { UserRepository } from '../repository/user.repository';
import { OnboardingStep } from '../types/user.interface';

import { users } from './data';

@Injectable()
export class UserSeeder implements OnModuleInit {
  private readonly logger = new Logger(UserSeeder.name);

  constructor(
    private readonly user: UserRepository,
    private readonly role: RoleRepository,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    this.logger.log('Seeding users for roles...');

    for (const userSeed of users) {
      const role = await this.role.findOne({ name: userSeed.role });
      if (!role) {
        this.logger.warn(`Role not found: ${userSeed.role}`);
        continue;
      }

      const existingUser = await this.user.findOne({ phone: userSeed.phone });
      if (existingUser) {
        this.logger.log(`User already exists: ${userSeed.phone}`);
        continue;
      }

      const hashedPin = await hashResource(userSeed.pin);

      await this.user.create({
        phone: userSeed.phone,
        pin: hashedPin,
        roleId: role._id,
        phoneVerified: true,
        status: UserStatus.ACTIVE,
        onboardingStep: OnboardingStep.COMPLETED,
      });

      this.logger.log(`Created user for role: ${role.name}`);
    }

    this.logger.log('User seeding completed');
  }
}
