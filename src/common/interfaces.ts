export interface IObject<T = unknown> {
  [key: string]: T;
}

export interface IResponseCommon<ResultType> {
  result: ResultType;
  meta?: {
    total: number;
    page: number;
  };
}

export interface IResponseStatus {
  result: boolean;
}


