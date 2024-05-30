import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {SystemLogger} from '@modules/logger/logger.service';
import {BaseServiceAbstract} from 'src/services/base/base.abstract.service';
import {Token, User} from '@entities/index';
import {TokenRepositoryInterface} from '../interface/token.repository.interface';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {Status} from '@common/const';

@Injectable()
export class TokenService extends BaseServiceAbstract<Token> {
  constructor(
    @Inject('TokenRepositoryInterface') private tokenRepository: TokenRepositoryInterface,
    private jwtService: JwtService,
    private configService: ConfigService,
    private logger: SystemLogger,
  ) {
    super(tokenRepository);
    this.logger.setContext(TokenService.name);
  }

  async newToken(data: Partial<User>): Promise<Token> {
    const {_id, email, role} = data;

    const payload = {_id, email, role};

    try {
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<string>('JWT_EXPIRE_IN'),
      });

      const createToken = await this.tokenRepository.create({
        user_id: _id,
        access_token: accessToken,
        status: Status.VALID,
      });

      return createToken;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        `Error create access token: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async revokeToken(token: string, userId: string): Promise<boolean> {
    try {
      const foundToken = await this.tokenRepository.update(
        {access_token: token, userId},
        {status: Status.INVALID},
      );

      return !!foundToken;
    } catch (error) {
      throw new HttpException(
        `Error revoke access token: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
