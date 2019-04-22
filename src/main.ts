// tslint:disable-next-line: no-var-requires
require('dotenv').config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';

import { AppModule } from './app.module';

import { QueryExceptionFilter } from '@/common/filter/query-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(compression());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  // mysql查询错误捕获
  app.useGlobalFilters(new QueryExceptionFilter());

  // swagger 文档
  const options = new DocumentBuilder()
    .setTitle('Soap')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT);
  Logger.log(`Server running on http://localhost:${process.env.PORT} 🚀 👌`, 'Bootstrap');
}

bootstrap();
