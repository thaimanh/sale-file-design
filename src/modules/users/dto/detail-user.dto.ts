import {ObjectId} from 'mongodb';
import {User} from '../schema/user.schema';

export class DetailUserDTO extends User {
  _id: ObjectId;
}
