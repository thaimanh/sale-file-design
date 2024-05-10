import {Module} from '@nestjs/common';
import {AuthModule} from './modules/auth/auth.module';
import {UsersModule} from './modules/users/users.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {IsUniqueConstraint} from './validation/unique.rule';
import {APP_GUARD} from '@nestjs/core';
import {RolesGuard} from './modules/auth/guard/roles.guard';
import {JWTGuard} from './modules/auth/guard';
import {MailModule} from './modules/mail/mail.module';
import {LoggerModule} from './modules/logger/logger.module';
import {MongooseModule} from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    AuthModule,
    UsersModule,
    LoggerModule,
    MongooseModule.forRoot('mongodb://localhost:27017'),
    // MongooseModule.forRootAsync({
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>('DB_URL'),
    //   }),
    //   inject: [ConfigService],
    // }),
    MailModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [
    {provide: APP_GUARD, useClass: JWTGuard},
    {provide: APP_GUARD, useClass: RolesGuard},
  ],
})
export class AppModule {}
