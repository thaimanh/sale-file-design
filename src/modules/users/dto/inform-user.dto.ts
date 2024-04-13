import {OmitType} from '@nestjs/mapped-types';
import {CreateUserDto} from './create-user.dto';

export class InformUserDTO extends OmitType(CreateUserDto, ['password'] as const) {
  createdAt: Date;
  updatedAt: Date;
}
