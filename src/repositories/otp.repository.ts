import {Otp} from '@entities/index';
import {OtpRepositoryInterface} from '@modules/auth/interface/otp.repository.interface';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {BaseRepositoryAbstract} from './base/base.abstract.repository';

@Injectable()
export class OtpRepository extends BaseRepositoryAbstract<Otp> implements OtpRepositoryInterface {
  constructor(
    @InjectModel(Otp.name)
    private readonly otpRepository: Model<Otp>,
  ) {
    super(otpRepository);
  }
}
