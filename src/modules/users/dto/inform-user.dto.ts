import {OmitType} from '@nestjs/mapped-types';
import {User} from '../schema/user.schema';

export class InformUserDTO extends OmitType(User, ['password', 'accessToken', 'otp'] as const) {}
