import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {BaseServiceAbstract} from 'src/services/base/base.abstract.service';
import {User} from '@entities/index';
import {UserRepositoryInterface} from './interfaces/user.repository.interfaces';
import {CreateUserDto} from './dto/create-user.dto';
import {escapeRegExp, hashMd5, objValidateKey} from '@helper/functions';
import {SearchUserDTO} from './dto';
import {ITEM_PER_PAGE, Role} from '@common/const';
import {IResponseCommon} from '@common/interfaces';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
  ) {
    super(usersRepository);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashPassword = await hashMd5(createUserDto.password);

      const user = await this.usersRepository.create({
        ...createUserDto,
        password: hashPassword,
      });

      return user;
    } catch (error) {
      throw new HttpException(`Create user error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async search(searchUserDTO: SearchUserDTO): Promise<IResponseCommon<User>> {
    const {keyword, sortKey, order, page} = searchUserDTO || {
      sortKey: 'createdAt',
      order: 1,
      page: 1,
    };

    const conditions = objValidateKey({
      lastName: keyword ? {$regex: escapeRegExp(keyword)} : null,
      role: Role.User,
    });

    const {count, items} = await this.findAll(conditions, {
      limit: ITEM_PER_PAGE,
      skip: (page - 1) * ITEM_PER_PAGE,
      sort: {
        [sortKey ?? 'createdAt']: order ?? 1,
      },
      lean: true,
    });

    return {result: items, meta: {total: count, page}};
  }
}
