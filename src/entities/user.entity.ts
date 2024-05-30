import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {BaseEntity} from '@modules/shared/base.entity';
import {HydratedDocument} from 'mongoose';

export enum GENDER {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User extends BaseEntity {
  @Prop({required: true, unique: true})
  email: string;

  @Prop({required: true, select: false})
  password: string;

  @Prop({
    required: true,
    set: (firstName: string) => {
      return firstName.trim();
    },
  })
  first_name: string;

  @Prop({
    required: true,
    set: (lastName: string) => {
      return lastName.trim();
    },
  })
  last_name: string;

  @Prop({
    match: /^([+]\d{2})?\d{10}$/,
  })
  phone_number: string;

  @Prop({
    enum: GENDER,
  })
  gender: string;

  @Prop({required: true})
  birthday: string;

  @Prop({required: true})
  role: string;

  @Prop({required: true, default: 0})
  point: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
