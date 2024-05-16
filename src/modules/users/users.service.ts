import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from './schema/user.schema';
import {InformUserDTO, UpdateUserDto, SearchUserDTO} from './dto';
import {ITEM_PER_PAGE, Role} from 'src/common/const';
import {IObject, IResponseCommon, IResponseStatus} from '~/common/interfaces';
import {Model, SortOrder} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {objValidateKey, escapeRegExp} from '~/helper/functions';
import {DetailUserDTO} from './dto/detail-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async search(searchUserDTO: SearchUserDTO): Promise<IResponseCommon<InformUserDTO[]>> {
    const {keyword, sortKey, order, page} = searchUserDTO || {};

    const $regex = escapeRegExp(keyword);
    const query = $regex
      ? this.userModel.find({fullName: $regex, roles: Role.User})
      : this.userModel.find();

    if (sortKey) {
      query.sort({[sortKey]: order} as IObject<SortOrder>);
    }

    if (page) {
      query.skip((page - 1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE);
    }

    const searchUser = await query.lean();

    return {
      result: searchUser,
      meta: {total: searchUser?.length ?? 0, page},
    };
  }

  async displayById(id: string) {
    const detailUser = await this.userModel.findById(id).lean();

    return {
      result: detailUser,
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
