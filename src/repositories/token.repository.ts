import {Token} from '@entities/index';
import {TokenRepositoryInterface} from '@modules/auth/interface/token.repository.interface';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {BaseRepositoryAbstract} from './base/base.abstract.repository';

@Injectable()
export class TokenRepository
  extends BaseRepositoryAbstract<Token>
  implements TokenRepositoryInterface
{
  constructor(
    @InjectModel(Token.name)
    private readonly tokenRepository: Model<Token>,
  ) {
    super(tokenRepository);
  }
}
