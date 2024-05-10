import {OmitType} from '@nestjs/mapped-types';
import {User} from '../schema/user.schema';

export class UpdateUserDto extends OmitType(User, ['roles'] as const) {}
