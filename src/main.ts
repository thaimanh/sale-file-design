import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import {ClassSerializerInterceptor, ValidationPipe} from '@nestjs/common';
import {useContainer} from 'class-validator';
import * as cookieParser from 'cookie-parser';
import {SystemLogger} from './modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  // wrap AppModule with UseContainer
  useContainer(app.select(AppModule), {fallbackOnErrors: true});

  // app use custom logger
  app.useLogger(app.get(SystemLogger));

  // app use global pipes to automatically validate requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      skipMissingProperties: true,
    }),
  );

  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // initialization cookie
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
