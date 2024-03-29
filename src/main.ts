/// <reference types="../typings/index" />
/// <reference types="../typings/typing" />
/// <reference types="../typings/express" />
/// <reference types="../typings/socket" />

import '../env';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import * as Sentry from '@sentry/node';

import { AppModule } from './app.module';
import { Logger, LoggingService } from './shared/logging/logging.service';

const bootstrap = async () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    debug: true,
  });

  const server = await NestFactory.create(AppModule, {
    logger: new LoggingService(),
    cors: false,
  });
  // const limiter = new RateLimit({
  //   store: new RedisStore({
  //     client: new Redis({
  //       host: process.env.REDIS_HOST,
  //       port: Number(process.env.REDIS_PORT),
  //       db: Number(process.env.REDIS_DB),
  //       password: process.env.REDIS_PASSWORD,
  //       keyPrefix: process.env.REDIS_PREFIX,
  //     }),
  //   }),
  //   windowMs: 15 * 1000,
  //   max: 10000,
  // });
  // server.use(limiter);
  server.use(bodyParser.json({ limit: '50mb' }));
  server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  server.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  server.use(compression());
  server.use(cookieParser());
  // server.useGlobalInterceptors(new TransformInterceptor());
  server.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  await server.listen(process.env.PORT!);

  Logger.log(
    `Server running on http://localhost:${process.env.PORT} 🚀 👌`,
    'Bootstrap'
  );
};

bootstrap();
