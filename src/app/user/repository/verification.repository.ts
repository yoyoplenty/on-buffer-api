import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '@on/repository/base.repository';

import { Verification, VerificationDocument } from '../model/verification.model';

export class VerificationRepository extends BaseRepository<VerificationDocument> {
  constructor(@InjectModel(Verification.name) private verificationModel: Model<VerificationDocument>) {
    super(verificationModel);
  }
}
