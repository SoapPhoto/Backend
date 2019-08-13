/* eslint-disable import/first */
/// <reference types="../typings/index" />
require('dotenv').config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

import { AppModule } from './app.module';
import { LoggingService } from './shared/logging/logging.service';

const bootstrap = async () => {
  const server = await NestFactory.create(AppModule, {
    logger: new LoggingService(),
  });
  const limiter = new RateLimit({
    store: new RedisStore({
      client: new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        db: Number(process.env.REDIS_DB),
        password: process.env.REDIS_PASSWORD,
        keyPrefix: process.env.REDIS_PRIFIX,
      }),
    }),
    windowMs: 15 * 1000,
    max: 10000,
  });
  server.use(limiter);
  server.use(helmet());
  server.use(compression());
  server.use(cookieParser());
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
