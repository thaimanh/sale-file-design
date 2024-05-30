import {Token, TokenSchema} from '@entities/index';
import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {LoggerModule} from '@modules/logger/logger.module';
import {TokenRepository} from '@repositories/token.repository';
import {TokenService} from './token.service';
import {JwtModule} from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}]),
    LoggerModule,
    JwtModule,
  ],
  providers: [
    TokenService,
    {
      provide: 'TokenRepositoryInterface',
      useClass: TokenRepository,
    },
  ],
  exports: [TokenService],
})
export class TokenModule {}
