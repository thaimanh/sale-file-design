import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {LoginUserDTO} from './dto';
import {compareHash} from '@helper/functions';
import {IResponseStatus} from '@common/interfaces';
import {Response} from 'express';
import {MailService} from '../mail/mail.service';
import {SystemLogger} from '../logger/logger.service';
import {OtpService} from './otp/otp.service';
import {UsersService} from '@modules/users/users.service';
import {TokenService} from './token/token.service';
import {ConfigService} from '@nestjs/config';
import {CreateUserDto} from '@modules/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private userService: UsersService,
    private configService: ConfigService,
    private mailService: MailService,
    private otpService: OtpService,
    private logger: SystemLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async register(createUserDto: CreateUserDto): Promise<IResponseStatus> {
    try {
      const newUser = await this.userService.create(createUserDto);

      // Send mail
      if (newUser) {
        const otp = await this.otpService.newOtp(newUser._id);

        this.mailService
          .sendMail({
            to: newUser.email,
            subject: 'Verify your email',
            template: 'confirmation',
            context: {
              name: newUser.first_name + ' ' + newUser.last_name,
              url: `${this.configService.get<string>('SERVER_URL')}/auth/verify?otp=${otp}&id=${newUser._id}`,
            },
          })
          .then(({response}) => {
            response.includes('OK') &&
              this.logger.log(`Send mail to ${newUser.email} successfully`);
          });
      }

      return {result: true};
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(`Register user error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginUserDto: LoginUserDTO, response: Response) {
    const {email, password} = loginUserDto || {};

    const foundUser = await this.userService.findOneByCondition(
      {email},
      'password _id email first_name last_name role',
    );

    if (!foundUser) {
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);
    }

    if (!compareHash(password, foundUser.password)) {
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);
    }

    const {access_token} = await this.tokenService.newToken(foundUser);

    response.cookie('accessToken', access_token, {httpOnly: true});

    return response.send({
      result: {
        id: foundUser._id,
        email: foundUser.email,
        fullName: foundUser.first_name + ' ' + foundUser.last_name,
      },
    });
  }

  async logout(request: any, response: Response) {
    console.log(request);

    const {accessToken} = request.cookies;
    const userId = request.user.id;

    this.logger.log(`User logged out token::${accessToken} userId::${userId}`);

    try {
      await this.tokenService.revokeToken(userId, accessToken);
      response.clearCookie('accessToken');
      response.send({result: true});
    } catch (error) {
      throw new HttpException('Error logout', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verify(params: {userId: string; otp: string}) {
    return this.otpService.verify(params);
  }

  async sendMailResetPassword(mail: string) {
    const foundUser = await this.userService.findOneByCondition({email: mail});

    if (!foundUser) {
      return {result: false};
    }

    const otp = await this.otpService.newOtp(foundUser._id);

    return this.mailService
      .sendMail({
        to: foundUser.email,
        subject: 'Verify your email',
        template: 'resetPassword',
        context: {
          name: foundUser.first_name + ' ' + foundUser.last_name,
          url: `${this.configService.get<string>('SERVER_URL')}/auth/verify?otp=${otp}&id=${foundUser._id}`,
        },
      })
      .then(({response}) => {
        response.includes('OK') && this.logger.log(`Send mail to ${foundUser.email} successfully`);
      });
  }
}
