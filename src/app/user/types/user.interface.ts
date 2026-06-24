import { ObjectId } from 'mongodb';

import { UserStatus } from '@on/enum';
import { IBaseType } from '@on/utils/types';

export enum OnboardingStep {
  NOT_STARTED = 'not_started',
  PERSONAL = 'personal',
  EMPLOYMENT = 'employment',
  VERIFICATION = 'verification',
  REPAYMENT = 'repayment',
  SECURITY = 'security',
  REVIEW = 'review',
  COMPLETED = 'completed',
}

export interface IUser extends IBaseType {
  phone: string;
  roleId: ObjectId;
  pin: string;
  phoneVerified: boolean;
  status: UserStatus;
  onboardingStep: OnboardingStep;
  lastLogin: Date;
}
