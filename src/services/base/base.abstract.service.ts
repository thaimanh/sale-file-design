import {BaseEntity} from '@modules/shared/base.entity';
import {BaseRepositoryInterface} from '@repositories/base/base.interface.repository';
import {FindAllResponse} from '@common/type';
import {BaseServiceInterface} from './base.interface.service';
import {QueryOptions} from 'mongoose';

export abstract class BaseServiceAbstract<T extends BaseEntity> implements BaseServiceInterface<T> {
  constructor(private readonly repository: BaseRepositoryInterface<T>) {}

  async create(createDto: T | any): Promise<T> {
    return await this.repository.create(createDto);
  }

  async findAll(filter?: Partial<T>, options?: QueryOptions<T>): Promise<FindAllResponse<T>> {
    return await this.repository.findAll(filter, options);
  }
  async findOneById(id: string, projection?: string): Promise<T> {
    return await this.repository.findOneById(id, projection);
  }

  async findOneByCondition(conditions: Partial<T>, projection?: string): Promise<T> {
    return await this.repository.findOneByCondition(conditions, projection);
  }

  async update(condition: object, updateDto: Partial<T>) {
    return await this.repository.update(condition, updateDto);
  }

  async remove(id: string) {
    return await this.repository.softDelete(id);
  }
}
