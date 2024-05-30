import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {BaseEntity} from '@modules/shared/base.entity';
import {HydratedDocument} from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

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
export class Item extends BaseEntity {
  @Prop({required: true})
  title: string;

  @Prop()
  description: string;

  @Prop({required: true})
  type: string;

  @Prop({required: true})
  price: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
