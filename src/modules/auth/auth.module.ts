import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../users/entities/user.entity';
import {ConfigModule} from '@nestjs/config';
import {JWTStrategy} from './strategy';
import {JwtModule} from '@nestjs/jwt';
import {LoggerModule} from '../logger/logger.module';
import {MyLogger} from '../logger/logger.service';
import {MailModule} from '../mail/mail.module';
import {MailService} from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    LoggerModule,
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRE_IN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, MailService, MyLogger],
})
export class AuthModule {}
