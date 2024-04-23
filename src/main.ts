import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {useContainer} from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // wrap AppModule with UseContainer
  useContainer(app.select(AppModule), {fallbackOnErrors: true});

  // app use global pipes to automatically validate requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      skipMissingProperties: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
