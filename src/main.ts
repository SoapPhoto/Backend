// tslint:disable-next-line: no-var-requires
require('dotenv').config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { RenderModule, RenderService } from 'nest-next';

import Next from 'next/dist/server/next';

import { AppModule } from './app.module';
import { Logger, LoggingService } from './shared/logging/logging.service';

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
  server.useWebSocketAdapter(new WsAdapter(server));
  server.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost.com:3001',
    ],
  });

  const renderer = server.get(RenderModule);
  renderer.register(server, app, {
    viewsDir: '/views',
  });

  const service = server.get(RenderService);
  service.setErrorHandler(async (err, req, res) => {
    // const isJSON = /application\/json/g.test(req.headers.accept);
    // Logger.error(err.response);
    // if (isJSON) {
    //   if (err.response) {
    //     return res.json(err.response);
    //   }
    //   const error = {
    //     statusCode: 500,
    //     timestamp: new Date().toISOString(),
    //     message: err.message,
    //   };
    //   return res
    //     .status(500)
    //     .json(error);
    // }
    // if (err.response) {
    //   if (err.response.statusCode === 404) {
    //     return res.render('error', { status: 404, error: err.response });
    //   }
    //   return res.render('error', { status: 500, error: err.response });
    // }
    // return res.render('error', {  status: 500, error: err });

  });

  await server.listen(process.env.PORT!);

  // Logger.log(`Server running on http://localhost:${process.env.PORT} 🚀 👌`, 'Bootstrap');
}

bootstrap();
