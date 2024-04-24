import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {InjectRepository} from '@nestjs/typeorm';
import {Strategy, ExtractJwt} from 'passport-jwt';
import {User} from 'src/modules/users/entities/user.entity';
import {Repository} from 'typeorm';
import {Request} from 'express';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JWTStrategy.extractJWT]),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'accessToken' in req.cookies) {
      return req.cookies.accessToken;
    }
    return null;
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne();
    console.log(user);
    return {userId: payload.id, email: payload.email};
  }
}
