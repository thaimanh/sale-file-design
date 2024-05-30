import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Status} from '@common/const';
import {BaseEntity} from '@modules/shared/base.entity';
import mongoose, {HydratedDocument} from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Otp extends BaseEntity {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user_id: string;

  @Prop({required: true})
  otp: string;

  @Prop({required: true})
  expired_at: Date;

  @Prop({required: true, default: Status.INVALID})
  status: number;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
