export type PaginationType = {
  page: number;
  total: number;
};

export type IsUniqueType = {
  tableName: string;
  column: string;
};

export type SortOptions = {
  order: string;
  sort: string;
};

export type FindAllResponse<T> = {count: number; items: T[]};
