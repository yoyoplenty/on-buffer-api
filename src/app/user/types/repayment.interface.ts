import { ObjectId } from 'mongodb';

import { IBaseType } from '@on/utils/types';

export enum RepaymentMethod {
  DIRECT_METHOD = 'direct_method',
  CARD = 'card',
}

export interface IRepayment extends IBaseType {
  userId: ObjectId;
  customerId: ObjectId;
  repaymentMethod: RepaymentMethod;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export interface ICard extends IBaseType {
  userId: ObjectId;
  customerId: ObjectId;
  repaymentId: ObjectId;
  last4: string;
  brand: string;
  token: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: string;
}
