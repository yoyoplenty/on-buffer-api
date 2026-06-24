import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Document, HydratedDocument, Types } from 'mongoose';

import { IEmployment, SalaryRange } from '../types/employment.interface';

import { User } from './user.model';

export type EmploymentDocument = HydratedDocument<Employment>;

@Schema({ collection: 'employments', versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Employment extends Document implements IEmployment {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: ObjectId;

  @ApiProperty()
  @Prop({ type: String, required: false })
  employer: string;

  @ApiProperty()
  @Prop({ enum: SalaryRange, required: true })
  salaryRange: SalaryRange;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  salaryPaymentDay: number;

  @ApiProperty()
  @Prop({ type: [String], required: false })
  bankStatementFileUrls: string[];

  /**
   * UTILITY
   */
  @ApiHideProperty()
  user: User;
}

export const EmploymentSchema = SchemaFactory.createForClass(Employment);

EmploymentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});
