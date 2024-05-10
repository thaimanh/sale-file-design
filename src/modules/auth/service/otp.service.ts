import {Injectable} from '@nestjs/common';
import {addMinute} from '~/helper/dateUtils';
import {Status} from '~/common/const';
import {SystemLogger} from '~/modules/logger/logger.service';
import {UserService} from '~/modules/users/users.service';

@Injectable()
export class OtpService {
  constructor(
    private userService: UserService,
    private logger: SystemLogger,
  ) {
    this.logger.setContext(OtpService.name);
  }

  async verifyOtp(): Promise<boolean> {
    return true;
  }

  async revokeOtp(): Promise<boolean> {
    return true;
  }

  async newOtp(userId: any) {
    const otp = Math.random().toString(5).substring(2, 8);

    try {
      await this.userService.update(userId, {
        otp: {otp, expiresAt: addMinute(new Date(), 5), status: Status.VALID},
      });
      return otp;
    } catch (error) {
      this.logger.error(`Create new otp error: ${error}`);
      return null;
    }
  }
}
