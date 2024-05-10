import {IsInt, IsEmail, IsString, IsNotEmpty, MinLength, IsArray} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail(undefined, {message: 'Email is invalid'})
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  birthday: string;

  @IsNotEmpty()
  @IsArray()
  roles: string[];

  @IsNotEmpty()
  @IsInt()
  point: number;
}
