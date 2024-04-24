import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {User} from '../users/entities/user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {RegisterUserDto, LoginUserDTO} from './dto';
import {compareHash, hashMd5} from '../../helper/functions';
import {IResponseStatus} from '../../common/interfaces';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {Response} from 'express';
import {TokenUserDto} from './dto/token-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<IResponseStatus> {
    const {lastName, firstName, password} = registerUserDto || {};

    const hashPassword = await hashMd5(password);

    try {
      const newUser = this.userRepository.create({
        ...registerUserDto,
        password: hashPassword,
        fullName: firstName + ' ' + lastName,
      });

      await this.userRepository.save(newUser);

      return {result: true};
    } catch (error) {
      console.error(error);
      throw new HttpException(`Register user error: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginUserDto: LoginUserDTO, response: Response) {
    const {email, password} = loginUserDto || {};

    const user = await this.userRepository.findOne({where: {email: email}});

    if (!user) {
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);
    }

    if (!compareHash(password, user.password)) {
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);
    }

    const accessToken = await this.genAccessToken(user);
    response.cookie('accessToken', accessToken, {httpOnly: true});

    return response.send({result: {id: user.id, email: user.email, fullName: user.fullName}});
  }

  async logout(userId: string, response: Response) {
    try {
      await this.userRepository.update(userId, {accessToken: null});

      response.clearCookie('accessToken');

      response.send({result: true});
    } catch (error) {
      throw new HttpException('Error revoke token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async genAccessToken(data: any): Promise<string> {
    const {id, email} = data;
    const payload = {id, email};

    try {
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<string>('JWT_EXPIRE_IN'),
      });

      await this.userRepository.update(id, {accessToken: accessToken});

      return accessToken;
    } catch (error) {
      throw new HttpException('Error gen access token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
