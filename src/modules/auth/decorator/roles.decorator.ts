import {SetMetadata} from '@nestjs/common';
import {ROLES_KEY} from '../../../common/const';
import {Role} from '../../../common/const';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
