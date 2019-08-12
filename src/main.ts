/* eslint-disable import/first */
/// <reference types="../typings/index" />
require('dotenv').config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { LoggingService } from './shared/logging/logging.service';

const bootstrap = async () => {
  const server = await NestFactory.create(AppModule, {
    logger: new LoggingService(),
  });
  server.use(compression());
  server.use(cookieParser());
  // 404
  // server.useGlobalFilters(new NoFoundExceptionFilter());
  server.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  server.enableCors({
    origin: false,
  });

  await server.listen(process.env.PORT!);

  // Logger.log(`Server running on http://localhost:${process.env.PORT} 🚀 👌`, 'Bootstrap');
};

bootstrap();
