import {FindAllResponse} from '@common/type';

export interface Write<T> {
  create(item: T | any): Promise<T>;
  update(condition: object, item: Partial<T>): Promise<T>;
  remove(id: string): Promise<boolean>;
}

export interface Read<T> {
  findAll(filter?: object, options?: object): Promise<FindAllResponse<T>>;
  findOneById(id: string): Promise<T>;
  findOneByCondition(conditions: object, projection?: string): Promise<T>;
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {}
