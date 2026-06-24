import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Document, HydratedDocument, Types } from 'mongoose';

import { VerificationStatus, IVerification, IdType } from '../types/verification.interface';

import { User } from './user.model';

export type VerificationDocument = HydratedDocument<Verification>;

@Schema({ collection: 'verifications', versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Verification extends Document implements IVerification {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: ObjectId;

  @ApiProperty()
  @Prop({ type: String, required: false })
  bvn: string;

  @ApiProperty()
  @Prop({ type: Boolean, required: true, default: false })
  bvnVerified: boolean;

  @ApiProperty()
  @Prop({ enum: IdType, required: true })
  type: IdType;

  @ApiProperty()
  @Prop({ type: String, required: false })
  value: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  documentUrl: string;

  @ApiProperty()
  @Prop({ enum: VerificationStatus, required: true, default: VerificationStatus.PENDING })
  status: VerificationStatus;

  @ApiProperty()
  @Prop({ type: Date })
  verifiedAt: Date;

  /**
   * UTILITY
   */
  @ApiHideProperty()
  user: User;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);

VerificationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});
