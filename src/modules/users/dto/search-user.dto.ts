import {IsNumber, IsString} from 'class-validator';

export class SearchUserDTO {
  @IsString()
  keyword: string;
  @IsNumber()
  page: number;
  @IsString()
  order: string;
  @IsString()
  sortKey: string;
}
