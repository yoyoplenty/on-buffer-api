import { ObjectId } from 'mongodb';

import { IBaseType } from '@on/utils/types';

import { OnboardingStep } from './user.interface';

export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  IN_PROGRESS = 'in_progress',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface IApplication extends IBaseType {
  userId: ObjectId;
  applicationId: string;
  currentStep: OnboardingStep;
  status: ApplicationStatus;
  submittedAt: Date;
  approvedAt: Date;
  rejectionReason: string;
}
