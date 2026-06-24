import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '@on/repository/base.repository';

import { Card, CardDocument } from '../model/card.model';

export class CardRepository extends BaseRepository<CardDocument> {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {
    super(cardModel);
  }
}
