import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../users/entities/user.entity';
import {ConfigModule} from '@nestjs/config';
import {JWTStrategy} from './strategy';
import {JwtModule} from '@nestjs/jwt';
import {MailerModule} from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    JwtModule.register({}),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
})
export class AuthModule {}
