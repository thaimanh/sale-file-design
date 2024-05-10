import {IsInt, IsNumber, IsString} from 'class-validator';

export class SearchUserDTO {
  @IsString()
  keyword: string;
  @IsNumber()
  page: number;
  @IsInt()
  order: number;
  @IsString()
  sortKey: string;
}
