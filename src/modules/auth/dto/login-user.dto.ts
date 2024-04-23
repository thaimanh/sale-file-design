import {IsEmail, IsNotEmpty} from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty()
  @IsEmail(undefined, {message: 'Email is invalid'})
  email: string;

  @IsNotEmpty()
  password: string;
}
