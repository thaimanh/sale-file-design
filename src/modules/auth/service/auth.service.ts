import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from '~/modules/users/schema/user.schema';
import {RegisterUserDto, LoginUserDTO} from '../dto';
import {compareHash, hashMd5} from '~/helper/functions';
import {IResponseStatus} from '~/common/interfaces';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {Response} from 'express';
import {MailService} from '../../mail/mail.service';
import {SystemLogger} from '../../logger/logger.service';
import {OtpService} from '../service';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {UserService} from '~/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private otpService: OtpService,
    private logger: SystemLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async register(registerUserDto: RegisterUserDto): Promise<IResponseStatus> {
    const {lastName, firstName, password} = registerUserDto || {};

    const hashPassword = await hashMd5(password);

    try {
      const newUser = new this.userModel({
        ...registerUserDto,
        password: hashPassword,
        fullName: firstName + ' ' + lastName,
      });

      const savedUser = await newUser.save();

      if (savedUser) {
        // Send mail
        const otp = this.otpService.newOtp(newUser._id);

        this.mailService
          .sendMail({
            to: newUser.email,
            subject: 'Verify your email',
            template: 'confirmation',
            context: {
              name: newUser.fullName,
              url: `${this.configService.get<string>('SERVER_HOST')}/verifyOtp?otp=${otp}`,
            },
          })
          .then(({response}) => {
            response.includes('OK') &&
              this.logger.log(`Send mail to ${newUser.email} successfully`);
          });
      }

      return {result: true};
    } catch (error) {
      throw new HttpException(`Register user error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginUserDto: LoginUserDTO, response: Response) {
    const {email, password} = loginUserDto || {};

    const {result: foundUser} = await this.userService.detail({email});

    if (!foundUser) {
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);
    }

    if (!compareHash(password, foundUser.password)) {
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);
    }

    const accessToken = await this.genAccessToken(foundUser);
    response.cookie('accessToken', accessToken, {httpOnly: true});

    return response.send({
      result: {id: foundUser._id, email: foundUser.email, fullName: foundUser.fullName},
    });
  }

  async logout(userId: string, response: Response) {
    try {
      await this.userService.update(userId, {accessToken: null});

      response.clearCookie('accessToken');

      response.send({result: true});
    } catch (error) {
      throw new HttpException('Error revoke token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async verifyOtp(params: {userId: string; otp: string}) {
  //   return true;
  // }

  async genAccessToken(data: any): Promise<string> {
    const {_id, email} = data;

    const payload = {id: _id, email};

    try {
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<string>('JWT_EXPIRE_IN'),
      });

      await this.userService.update(_id, {accessToken: accessToken});

      return accessToken;
    } catch (error) {
      throw new HttpException('Error gen access token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
