import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Document, HydratedDocument, Types } from 'mongoose';

import { ApplicationStatus, IApplication } from '../types/application.interface';
import { OnboardingStep } from '../types/user.interface';

import { User } from './user.model';

export type ApplicationDocument = HydratedDocument<Application>;

@Schema({ collection: 'applications', versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Application extends Document implements IApplication {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;

  @ApiProperty()
  @Prop({ type: String, required: false })
  applicationId: string;

  @ApiProperty()
  @Prop({ enum: OnboardingStep, required: true })
  currentStep: OnboardingStep;

  @ApiProperty()
  @Prop({ enum: ApplicationStatus, required: true, default: ApplicationStatus.DRAFT })
  status: ApplicationStatus;

  @ApiProperty()
  @Prop({ type: Date })
  submittedAt: Date;

  @ApiProperty()
  @Prop({ type: Date })
  approvedAt: Date;

  @ApiProperty()
  @Prop({ type: String, required: false })
  rejectionReason: string;

  /**
   * UTILITY
   */
  @ApiHideProperty()
  user: User;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

ApplicationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});
