import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {Like, Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {InformUserDTO} from './dto/inform-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {ObjectId} from 'mongodb';
import {SearchUserDTO} from './dto/search-user.dto';
import {ITEM_PER_PAGE} from 'src/definition/const';
import {IResponseCommon} from 'src/definition/interfaces';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<InformUserDTO> {
    const {lastName, firstName, password} = createUserDto;

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashPassword,
      fullName: firstName + ' ' + lastName,
    });

    return this.userRepository.save(newUser);
  }

  async search(searchUserDTO: SearchUserDTO): Promise<IResponseCommon<InformUserDTO[]>> {
    const {keyword, sortKey, order, page} = searchUserDTO;

    const [users, total] = await this.userRepository.findAndCount({
      where: {fullName: Like(`%${keyword}%`)},
      order: {[sortKey]: order},
      skip: (page - 1) * ITEM_PER_PAGE,
      take: ITEM_PER_PAGE,
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt'],
    });

    return {result: users, meta: {total, page}};
  }

  async detail(id: ObjectId) {
    return await this.userRepository.findOne({where: {id}});
  }

  async update(id: ObjectId, updateUserDto: UpdateUserDto): Promise<InformUserDTO> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({where: {id}});
  }

  async remove(id: ObjectId) {
    await this.userRepository.delete(id);
  }
}
