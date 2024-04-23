import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {InjectRepository} from '@nestjs/typeorm';
import {Strategy, ExtractJwt} from 'passport-jwt';
import {User} from 'src/modules/users/entities/user.entity';
import {Repository} from 'typeorm';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    console.log('Inside validate token', payload);
    // validate token here
    const user = await this.userRepository.findOne({where: {id: payload.sub}});
    console.log(user);
    return {userId: payload.sub, username: payload.username};
  }
}
