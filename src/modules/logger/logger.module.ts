import {Global, Module} from '@nestjs/common';
import {SystemLogger} from './logger.service';

@Global()
@Module({
  providers: [SystemLogger],
  exports: [SystemLogger],
})
export class LoggerModule {}
