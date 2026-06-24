import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '@on/repository/base.repository';

import { Application, ApplicationDocument } from '../model/application.model';

export class ApplicationRepository extends BaseRepository<ApplicationDocument> {
  constructor(@InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>) {
    super(applicationModel);
  }
}
