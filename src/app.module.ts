import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AuthModule} from './modules/auth/auth.module';
import {UsersModule} from './modules/users/users.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {APP_GUARD} from '@nestjs/core';
import {RolesGuard} from './modules/auth/guard/roles.guard';
import {JWTGuard} from './modules/auth/guard';
import {MailModule} from './modules/mail/mail.module';
import {LoggerModule} from './modules/logger/logger.module';
import {MongooseModule} from '@nestjs/mongoose';
import LoggerMiddleware from './middleware/log.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    AuthModule,
    UsersModule,
    LoggerModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
        dbName: configService.get<string>('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    MailModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [
    {provide: APP_GUARD, useClass: RolesGuard},
    {provide: APP_GUARD, useClass: JWTGuard},
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
