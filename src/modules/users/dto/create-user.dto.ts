import {PartialType} from '@nestjs/mapped-types';
import {User} from '../entities/user.entity';

export class CreateUserDto extends PartialType(User) {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: number;
  point: number;
  birthday: string;
}
