import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {SystemLogger} from '@modules/logger/logger.service';
import {OtpRepositoryInterface} from '../interface/otp.repository.interface';
import {BaseServiceAbstract} from 'src/services/base/base.abstract.service';
import {Otp} from '@entities/index';
import {addMinute} from '@helper/dateUtils';
import {Status} from '@common/const';

@Injectable()
export class OtpService extends BaseServiceAbstract<Otp> {
  constructor(
    @Inject('OtpRepositoryInterface') private otpRepository: OtpRepositoryInterface,
    private logger: SystemLogger,
  ) {
    super(otpRepository);
    this.logger.setContext(OtpService.name);
  }

  async verify(params: {otp: string; userId: string}): Promise<boolean> {
    const {otp, userId} = params;

    const foundOtp = await this.otpRepository.findOneByCondition({otp, userId});

    if (!foundOtp) {
      return false;
    }

    if (
      foundOtp.expired_at.getTime() < Date.now() ||
      foundOtp.status === Status.INVALID ||
      foundOtp.deleted_at
    ) {
      return false;
    }

    await this.otpRepository.update({_id: foundOtp._id}, {status: Status.INVALID});

    return true;
  }

  async newOtp(userId: any) {
    const otp = Math.random().toString(5).substring(2, 12);

    try {
      await this.otpRepository.create({
        otp,
        user_id: userId,
        expired_at: addMinute(new Date(), 5),
        status: Status.VALID,
      });
      return otp;
    } catch (error) {
      throw new HttpException(`Create otp error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
