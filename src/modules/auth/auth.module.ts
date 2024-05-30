import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {ConfigModule} from '@nestjs/config';
import {JWTStrategy} from './strategy';
import {JwtModule} from '@nestjs/jwt';
import {LoggerModule} from '../logger/logger.module';
import {MailModule} from '../mail/mail.module';
import {MongooseModule} from '@nestjs/mongoose';
import {UsersModule} from '../users/users.module';
import {Token, TokenSchema, User, UserSchema, Otp, OtpSchema} from '@entities/index';
import {TokenModule} from './token/token.module';
import {OtpModule} from './otp/otp.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
      {name: Token.name, schema: TokenSchema},
      {name: Otp.name, schema: OtpSchema},
    ]),
    ConfigModule,
    LoggerModule,
    MailModule,
    UsersModule,
    TokenModule,
    OtpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRE_IN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
})
export class AuthModule {}
