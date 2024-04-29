import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../users/entities/user.entity';
import {Repository} from 'typeorm';

@Injectable()
export class otpService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async verifyOtp(): Promise<boolean> {
    return true;
  }

  async revokeOtp(): Promise<boolean> {
    return true;
  }

  async newOtp() {}
}
