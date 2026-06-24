import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Document, HydratedDocument, Types } from 'mongoose';

import { Role } from '@on/app/role/model/role.model';
import { UserStatus } from '@on/enum';

import { IUser, OnboardingStep } from '../types/user.interface';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User extends Document implements IUser {
  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  phone: string;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  roleId: ObjectId;

  @ApiProperty()
  @Prop({ type: String, required: false })
  pin: string;

  @ApiProperty()
  @Prop({ type: Boolean, required: true, default: false })
  phoneVerified: boolean;

  @ApiProperty()
  @Prop({ enum: UserStatus, required: true, default: UserStatus.INACTIVE })
  status: UserStatus;

  @ApiProperty()
  @Prop({ enum: OnboardingStep, required: true, default: OnboardingStep.NOT_STARTED })
  onboardingStep: OnboardingStep;

  @ApiProperty()
  @Prop({ type: Date })
  lastLogin: Date;

  /**
   * UTILITY
   */
  @ApiHideProperty()
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('role', {
  ref: 'Role',
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
});
