import {Prop} from '@nestjs/mongoose';

export class BaseEntity {
  _id?: string;

  @Prop({type: Date, default: null})
  deleted_at: Date;
}
