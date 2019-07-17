// tslint:disable-next-line: no-var-requires
require('dotenv').config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { RenderModule, RenderService } from 'nest-next';

import Next from 'next';

import { AppModule } from './app.module';
import { LoggingService } from './shared/logging/logging.service';

async function bootstrap() {
  const dev = process.env.NODE_ENV !== 'production';
  const app = Next({
    dev,
  });

  await app.prepare();

  const server = await NestFactory.create(AppModule, {
    logger: new LoggingService(),
  });
  server.use(compression());
  server.use(cookieParser());
  server.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  server.enableCors({
    origin: false,
  });

  const renderer = server.get(RenderModule);
  renderer.register(server, app, {
    dev,
    viewsDir: '/views',
  });

  server.get(RenderService);

  await server.listen(process.env.PORT!);

  // Logger.log(`Server running on http://localhost:${process.env.PORT} 🚀 👌`, 'Bootstrap');
}

bootstrap();
