import {Injectable} from '@nestjs/common';
import {Like, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {InformUserDTO} from './dto/inform-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {SearchUserDTO} from './dto/search-user.dto';
import {ITEM_PER_PAGE} from 'src/common/const';
import {IObject, IResponseCommon} from 'src/common/interfaces';
import {objValidateKey} from '../../helper/functions';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async search(searchUserDTO: SearchUserDTO): Promise<IResponseCommon<InformUserDTO[]>> {
    const {keyword, sortKey, order, page} = searchUserDTO || {};

    const conditions: IObject = {
      where: keyword && {fullName: Like(`%${keyword}%`)},
      order: sortKey ? {[sortKey]: order} : {createdAt: 'desc'},
      skip: page && (page - 1) * ITEM_PER_PAGE,
      take: ITEM_PER_PAGE,
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt'],
    };

    const [users, total] = await this.userRepository.findAndCount(objValidateKey(conditions));

    return {result: users, meta: {total, page}};
  }

  async detail(id: any) {
    return await this.userRepository.findOne(id);
  }

  async update(id: any, updateUserDto: UpdateUserDto): Promise<InformUserDTO> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({where: {id}});
  }

  async remove(id: any) {
    await this.userRepository.delete(id);
  }
}
