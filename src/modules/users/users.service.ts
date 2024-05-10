import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from './schema/user.schema';
import {InformUserDTO, UpdateUserDto, SearchUserDTO} from './dto';
import {ITEM_PER_PAGE} from 'src/common/const';
import {IObject, IResponseCommon, IResponseStatus} from '~/common/interfaces';
import {Model, SortOrder} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {objFilterKeys, objValidateKey, escapeRegExp} from '~/helper/functions';
import {keys} from 'ts-transformer-keys';
import {DetailUserDTO} from './dto/detail-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async search(searchUserDTO: SearchUserDTO): Promise<IResponseCommon<InformUserDTO[]>> {
    const {keyword, sortKey, order, page} = searchUserDTO || {};

    // const conditions: IObject = {
    //   where: keyword && {fullName: Like(`%${keyword}%`)},
    //   order: sortKey ? {[sortKey]: order} : {createdAt: 'desc'},
    //   skip: page && (page - 1) * ITEM_PER_PAGE,
    //   take: ITEM_PER_PAGE,
    //   select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt'],
    // };

    const $regex = escapeRegExp(keyword);
    const query = keyword ? this.userModel.find({fullName: $regex}) : this.userModel.find();

    if (sortKey) {
      query.sort({[sortKey]: order} as IObject<SortOrder>);
    }

    if (page) {
      query.skip((page - 1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE);
    }

    const searchUser = await query.lean();

    return {result: searchUser, meta: {total: searchUser?.length ?? 0, page}};
  }

  async display(id: string): Promise<IResponseCommon<InformUserDTO>> {
    const detailUser: InformUserDTO = await this.userModel.findById(id).lean();

    return {
      result: objFilterKeys(detailUser, keys<InformUserDTO>()) as InformUserDTO,
      meta: {},
    };
  }

  async detail(conditions: IObject<any>): Promise<IResponseCommon<DetailUserDTO>> {
    const detailUser = await this.userModel.findOne(objValidateKey(conditions)).lean();

    return {
      result: detailUser,
      meta: {},
    };
  }

  async update(id: string, updateUserDto: Partial<UpdateUserDto>): Promise<IResponseStatus> {
    const updateUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true});

    if (!updateUser) {
      throw new HttpException(`Not found user ${id}`, HttpStatus.NOT_FOUND);
    }

    return {
      result: true,
    };
  }

  async remove(id: string) {
    const deleteUser = await this.userModel.findByIdAndDelete(id);

    if (!deleteUser) {
      throw new HttpException(`Not found user ${id}`, HttpStatus.NOT_FOUND);
    }

    return {
      result: true,
    };
  }
}
