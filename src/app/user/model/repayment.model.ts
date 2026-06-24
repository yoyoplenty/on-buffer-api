import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Document, HydratedDocument, Types } from 'mongoose';

import { IRepayment, RepaymentMethod } from '../types/repayment.interface';

import { User } from './user.model';

export type RepaymentDocument = HydratedDocument<Repayment>;

@Schema({ collection: 'repayments', versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Repayment extends Document implements IRepayment {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: ObjectId;

  @ApiProperty()
  @Prop({ enum: RepaymentMethod, required: true })
  repaymentMethod: RepaymentMethod;

  @ApiProperty()
  @Prop({ type: String, required: false })
  bankName: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  bankCode: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  accountNumber: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  accountName: string;

  /**
   * UTILITY
   */
  @ApiHideProperty()
  user: User;
}

export const RepaymentSchema = SchemaFactory.createForClass(Repayment);

RepaymentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});
