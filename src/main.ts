// tslint:disable-next-line: no-var-requires
require('dotenv').config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { RenderModule, RenderService } from 'nest-next';
import * as Next from 'next';

import { AppModule } from './app.module';

import { QueryExceptionFilter } from '@server/common/filter/query-exception.filter';

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
  // mysql查询错误捕获
  server.useGlobalFilters(new QueryExceptionFilter());

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
    const isJSON = /application\/json/g.test(req.headers.accept);
    if (err.response.statusCode === 404) {
      if (isJSON) {
        res.json(err.response);
      } else {
        res.render('404', err.response);
      }
    } else {
      if (isJSON) {
        res.json(err.response);
      } else {
        res.render('500', err.response);
      }
    }
  });

  await server.listen(process.env.PORT);

  Logger.log(`Server running on http://localhost:${process.env.PORT} 🚀 👌`, 'Bootstrap');
}

bootstrap();
