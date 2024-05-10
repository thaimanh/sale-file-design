import {IsString} from 'class-validator';

export class OneUserDTO {
  @IsString()
  email?: string;
  @IsString()
  id?: string;
}
