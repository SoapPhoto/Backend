// tslint:disable-next-line: no-var-requires
require('dotenv').config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AuthGuard } from './common/guard/auth.guard';
import { OauthMiddleware } from './common/middleware/oauth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AuthGuard());

  // swagger 文档
  const options = new DocumentBuilder()
    .setTitle('Soap')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT);
  Logger.log(`Server running on http://localhost:${process.env.PORT}`, 'Bootstrap');
}
bootstrap();
