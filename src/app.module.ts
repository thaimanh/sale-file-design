import {Module} from '@nestjs/common';
import {AuthModule} from './modules/auth/auth.module';
import {UsersModule} from './modules/users/users.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './modules/users/entities/user.entity';
import {IsUniqueConstraint} from './validation/unique.rule';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: '127.0.0.1',
      port: 27017,
      database: 'app',
      synchronize: true,
      entities: [User],
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
  ],
  controllers: [],
  providers: [IsUniqueConstraint],
})
export class AppModule {}
