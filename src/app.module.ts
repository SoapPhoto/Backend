
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RenderModule } from 'nest-next';

import { AuthModule } from '@server/auth/auth.module';
import { OauthModule } from '@server/oauth/oauth.module';
import { LoggingInterceptor } from '@server/shared/logging.interceptor';
import { ApiModule } from './api.module';
import { CacheModule } from './common/cache/cache.module';
import { OauthMiddleware } from './common/middleware/oauth.middleware';
import { ViewsModule } from './views/views.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    RenderModule,
    AuthModule,
    OauthModule,
    ViewsModule,
    CacheModule,
    ApiModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
