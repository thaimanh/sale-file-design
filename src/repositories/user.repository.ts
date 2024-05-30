import {User} from '@entities/index';
import {UserRepositoryInterface} from '@modules/users/interfaces/user.repository.interfaces';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {BaseRepositoryAbstract} from './base/base.abstract.repository';

@Injectable()
export class UsersRepository
  extends BaseRepositoryAbstract<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectModel(User.name)
    private readonly usersRepository: Model<User>,
  ) {
    super(usersRepository);
  }
}
