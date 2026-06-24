import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '@on/repository/base.repository';

import { Employment, EmploymentDocument } from '../model/employment.model';

export class EmploymentRepository extends BaseRepository<EmploymentDocument> {
  constructor(@InjectModel(Employment.name) private employmentModel: Model<EmploymentDocument>) {
    super(employmentModel);
  }
}
