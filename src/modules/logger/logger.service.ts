import {ConsoleLogger, Injectable} from '@nestjs/common';

@Injectable()
export class SystemLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    super.error(message, stack || context);
  }
}
