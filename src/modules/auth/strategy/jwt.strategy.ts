import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import {Request} from 'express';
import {UserService} from '~/modules/users/users.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userService: UserService,
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
    const accessToken = req.cookies.accessToken;

    const {result: foundUser} = await this.userService.detail({
      id: payload.id,
      accessToken: accessToken,
    });

    if (!foundUser) {
      return false;
    }

    return {id: payload.id, email: payload.email, roles: foundUser.roles};
  }
}
