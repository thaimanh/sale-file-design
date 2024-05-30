import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Status} from '@common/const';
import {BaseEntity} from '@modules/shared/base.entity';
import mongoose, {HydratedDocument} from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Token extends BaseEntity {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user_id: string;

  @Prop({required: true})
  access_token: string;

  @Prop({required: true, default: Status.VALID})
  status: number;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
