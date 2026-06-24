import { ObjectId } from 'mongodb';

import { IBaseType } from '@on/utils/types';

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed',
}

export enum IdType {
  NIN = 'nin',
  INTERNATIONAL_PASSPORT = 'international_passport',
  DRIVERS_LICENSE = 'drivers_license',
  VOTER_CARD = 'voter_card',
}

export interface IVerification extends IBaseType {
  userId: ObjectId;
  customerId: ObjectId;
  bvn: string;
  bvnVerified: boolean;
  type: IdType;
  value: string;
  documentUrl: string;
  status: VerificationStatus;
  verifiedAt: Date;
}
