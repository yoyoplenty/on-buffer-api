import { ObjectId } from 'mongodb';

import { IBaseType } from '@on/utils/types';

export enum SalaryRange {
  BELOW_50K = 'below_50k',
  RANGE_50k_100k = '50K_100k',
  RANGE_100k_150k = '100K_150k',
  RANGE_150k_250k = '150K_250k',
  RANGE_250k_400k = '250K_400k',
  ABOVE_400k = 'above_400k',
}

export interface IEmployment extends IBaseType {
  userId: ObjectId;
  customerId: ObjectId;
  employer: string;
  salaryRange: SalaryRange;
  salaryPaymentDay: number;
  bankStatementFileUrls: string[];
}
