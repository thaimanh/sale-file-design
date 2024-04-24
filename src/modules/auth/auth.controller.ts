import {Body, Controller, Post, Res} from '@nestjs/common';
import {AuthService} from './auth.service';
import {RegisterUserDto, LoginUserDTO} from '../auth/dto';
import {IResponseStatus} from '../../common/interfaces';
import {Response} from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  create(@Body() registerUserDto: RegisterUserDto): Promise<IResponseStatus> {
    return this.authService.register(registerUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDTO, @Res() response: Response) {
    return this.authService.login(loginUserDto, response);
  }
}
