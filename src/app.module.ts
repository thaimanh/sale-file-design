import {Module} from '@nestjs/common';
import {AuthModule} from './modules/auth/auth.module';
import {UsersModule} from './modules/users/users.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './modules/users/entities/user.entity';
import {ConfigModule} from '@nestjs/config';
import {IsUniqueConstraint} from './validation/unique.rule';
import {APP_GUARD} from '@nestjs/core';
import {RolesGuard} from './modules/auth/guard/roles.guard';
import {JWTGuard} from './modules/auth/guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      database: 'app',
      synchronize: true,
      entities: [User],
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
  ],
  controllers: [],
  providers: [
    IsUniqueConstraint,
    {provide: APP_GUARD, useClass: JWTGuard},
    {provide: APP_GUARD, useClass: RolesGuard},
  ],
})
export class AppModule {}
