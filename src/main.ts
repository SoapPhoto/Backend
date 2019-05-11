// tslint:disable-next-line: no-var-requires
require('dotenv').config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { RenderModule, RenderService } from 'nest-next';
import Next from 'next';

import { AppModule } from './app.module';

async function bootstrap() {
  const dev = process.env.NODE_ENV !== 'production';
  const app = Next({ dev });

  await app.prepare();

  const server = await NestFactory.create(AppModule);
  server.use(compression());
  server.use(cookieParser());
  server.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  server.useWebSocketAdapter(new WsAdapter(server));

  // swagger 文档
  const options = new DocumentBuilder()
    .setTitle('Soap')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(server, options);
  SwaggerModule.setup('docs', server, document);

  const renderer = server.get(RenderModule);
  renderer.register(server, app, {
    viewsDir: '/views',
  });

  const service = server.get(RenderService);
  service.setErrorHandler(async (err, req, res) => {
    Logger.error(err);
    const isJSON = /application\/json/g.test(req.headers.accept);
    if (isJSON) {
      if (err.response) {
        res.json(err.response);
      } else {
        res
          .status(500)
          .json({
            statusCode: 500,
            timestamp: new Date().toISOString(),
            message: err.message,
          });
      }
    } else {
      if (err.response) {
        if (err.response.statusCode === 404) {
          res.render('404', { error: err.response });
        } else {
          res.render('500', { error: err.response });
        }
      } else {
        res.render('500', {  error: err });
      }
    }
  });

  await server.listen(process.env.PORT!);

  Logger.log(`Server running on http://localhost:${process.env.PORT} 🚀 👌`, 'Bootstrap');
}

bootstrap();
