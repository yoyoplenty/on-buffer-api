import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Document, HydratedDocument, Types } from 'mongoose';

import { ICustomer } from '../types/customer.interface';

import { User } from './user.model';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ collection: 'customers', versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Customer extends Document implements ICustomer {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;

  @ApiProperty()
  @Prop({ type: String, required: false })
  pin: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  firstName: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  lastName: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  email: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  address: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  area: string;

  /**
   * UTILITY
   */
  @ApiHideProperty()
  user: User;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});
