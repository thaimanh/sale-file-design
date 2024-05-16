import {Body, Controller, Post, Req, Res} from '@nestjs/common';
import {AuthService} from './service/auth.service';
import {RegisterUserDto, LoginUserDTO} from '../auth/dto';
import {IResponseStatus} from '../../common/interfaces';
import {Response} from 'express';
import {Public} from './decorator';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @Public()
  create(@Body() registerUserDto: RegisterUserDto): Promise<IResponseStatus> {
    return this.authService.register(registerUserDto);
  }

  @Public()
  @Post('/login')
  login(@Body() loginUserDto: LoginUserDTO, @Res() response: Response) {
    return this.authService.login(loginUserDto, response);
  }

  @Post('/logout')
  logout(@Res() response: Response, @Req() request: any) {
    const userId = request.user.id;
    return this.authService.logout(userId, response);
  }
}
