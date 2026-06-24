import { ObjectId } from 'mongodb';

import { IBaseType } from '@on/utils/types';

export interface ICustomer extends IBaseType {
  userId: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  area: string;
}
