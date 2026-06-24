import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Document, HydratedDocument, Types } from 'mongoose';

import { ICard } from '../types/repayment.interface';

import { User } from './user.model';

export type CardDocument = HydratedDocument<Card>;

@Schema({ collection: 'cards', versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Card extends Document implements ICard {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Repayment', required: true })
  repaymentId: ObjectId;

  @ApiProperty()
  @Prop({ type: String, required: false })
  last4: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  brand: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  token: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  expiryMonth: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  expiryYear: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  isDefault: string;

  /**
   * UTILITY
   */
  @ApiHideProperty()
  user: User;
}

export const CardSchema = SchemaFactory.createForClass(Card);

CardSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});
