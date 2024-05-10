import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './service/auth.service';
import {User, UserSchema} from '../users/schema/user.schema';
import {ConfigModule} from '@nestjs/config';
import {JWTStrategy} from './strategy';
import {JwtModule} from '@nestjs/jwt';
import {LoggerModule} from '../logger/logger.module';
import {SystemLogger} from '../logger/logger.service';
import {MailModule} from '../mail/mail.module';
import {MailService} from '../mail/mail.service';
import {OtpService} from './service';
import {MongooseModule} from '@nestjs/mongoose';
import {UsersModule} from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ConfigModule,
    LoggerModule,
    MailModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRE_IN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, MailService, SystemLogger, OtpService],
})
export class AuthModule {}
