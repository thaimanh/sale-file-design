import {Body, Controller, Get, Post, Req, Res} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginUserDTO} from '../auth/dto';
import {IResponseStatus} from '../../common/interfaces';
import {Response, Request} from 'express';
import {Public} from './decorator';
import {CreateUserDto} from '@modules/users/dto/create-user.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @Public()
  register(@Body() createUserDto: CreateUserDto): Promise<IResponseStatus> {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('/login')
  login(@Body() loginUserDto: LoginUserDTO, @Res() response: Response) {
    return this.authService.login(loginUserDto, response);
  }

  @Public()
  @Get('/verify')
  verify(@Req() request: Request) {
    const {id, otp} = request.query;

    if (!id || !otp) return false;
    return this.authService.verify({userId: String(id), otp: String(otp)});
  }

  @Post('/logout')
  logout(@Res() response: Response, @Req() request: any) {
    const userId = request.user.id;
    return this.authService.logout(userId, response);
  }
}
