import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {User} from '../users/entities/user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {RegisterUserDto, LoginUserDTO} from './dto';
import {compareHash, hashMd5} from '../../helper/functions';
import {IResponseCommon, IResponseStatus} from '../../common/interfaces';
import {TokenUserDto} from './dto/token-user.dto';
import {JwtService} from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<IResponseStatus> {
    const {lastName, firstName, password} = registerUserDto || {};
    const hashPassword = hashMd5(password);

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

  async login(loginUserDto: LoginUserDTO): Promise<IResponseCommon<TokenUserDto>> {
    const {email, password} = loginUserDto || {};

    const user = await this.userRepository.findOne({where: {email: email}});

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!compareHash(password, user.password)) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const accessToken = await this.genAccessToken(user);

    return {result: {email, fullName: user.fullName, accessToken}};
  }

  async genAccessToken(data: any): Promise<string> {
    const payload = {sub: data.userId, username: data.username};
    return this.jwtService.signAsync(payload);
  }
}
