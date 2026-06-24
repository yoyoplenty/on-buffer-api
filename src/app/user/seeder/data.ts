import { UserStatus } from '@on/enum';

import { OnboardingStep } from '../types/user.interface';

export const users = [
  {
    role: 'super-admin',
    phone: '9000000001',
    pin: '1234',
    phoneVerified: true,
    status: UserStatus.ACTIVE,
    onboardingStep: OnboardingStep.COMPLETED,
  },
  {
    role: 'admin',
    phone: '9000000002',
    pin: '2345',
    phoneVerified: true,
    status: UserStatus.ACTIVE,
    onboardingStep: OnboardingStep.COMPLETED,
  },
  {
    role: 'user',
    phone: '9000000002',
    pin: '3456',
    phoneVerified: true,
    status: UserStatus.ACTIVE,
    onboardingStep: OnboardingStep.COMPLETED,
  },
];
