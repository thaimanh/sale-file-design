import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import {Request} from 'express';
import {TokenService} from '../token/token.service';
import {Status} from '@common/const';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JWTStrategy.extractJWT]),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'accessToken' in req.cookies) {
      return req.cookies.accessToken;
    }
    return null;
  }

  async validate(req: Request, payload: any) {
    const access_token = req.cookies.accessToken;

    const foundToken = await this.tokenService.findOneByCondition({
      access_token,
      user_id: payload._id,
      status: Status.VALID,
    });

    if (!foundToken) {
      return false;
    }

    return {id: payload.id, email: payload.email, role: payload.role};
  }
}
