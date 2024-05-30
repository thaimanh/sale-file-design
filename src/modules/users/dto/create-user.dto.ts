import {GENDER} from '@entities/user.entity';
import {IsInt, IsEmail, IsString, IsNotEmpty, MinLength, IsEnum} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail(undefined, {message: 'Email is invalid'})
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(GENDER)
  gender: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  birthday: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  @IsInt()
  point: number;
}
