import {OmitType} from '@nestjs/mapped-types';
import {User} from '../entities/user.entity';

export class InformUserDTO extends OmitType(User, ['password', 'accessToken'] as const) {}
