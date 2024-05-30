import {BaseEntity} from '@modules/shared/base.entity';
import {FilterQuery, Model, QueryOptions} from 'mongoose';
import {FindAllResponse} from '@common/type';
import {BaseRepositoryInterface} from './base.interface.repository';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseRepositoryInterface<T>
{
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  async create(dto: T | any): Promise<any> {
    const createdData = await this.model.create(dto);
    return createdData.save();
  }

  async findOneById(id: string, projection?: string): Promise<T> {
    const item = await this.model.findById(id, projection);
    return item.deleted_at ? null : item;
  }

  async findOneByCondition(condition = {}, projection?: string): Promise<T> {
    return await this.model
      .findOne(
        {
          ...condition,
          deleted_at: null,
        },
        projection,
      )
      .exec();
  }

  async findAll(condition: FilterQuery<T>, options?: QueryOptions<T>): Promise<FindAllResponse<T>> {
    const [count, items] = await Promise.all([
      this.model.countDocuments({...condition, deleted_at: null}),
      this.model.find({...condition, deleted_at: null}, options?.projection, options),
    ]);
    return {
      count,
      items,
    };
  }

  async update(condition: FilterQuery<T>, updateDto: Partial<T>): Promise<T> {
    return await this.model.findOneAndUpdate({_id: condition.id, deleted_at: null}, updateDto, {
      new: true,
    });
  }

  async softDelete(id: string): Promise<boolean> {
    const deleteItem = await this.model.findById(id);
    if (!deleteItem) {
      return false;
    }

    return !!(await this.model.findByIdAndUpdate<T>(id, {deleted_at: new Date()}).exec());
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const deleteItem = await this.model.findById(id);
    if (!deleteItem) {
      return false;
    }
    return !!(await this.model.findByIdAndDelete(id));
  }
}
