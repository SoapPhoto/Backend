
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RenderModule } from 'nest-next';

import { AuthModule } from '@server/auth/auth.module';
import { ClientModule } from '@server/oauth/client/client.module';
import { OauthModule } from '@server/oauth/oauth.module';
import { LoggingInterceptor } from '@server/shared/logging.interceptor';
import { CacheModule } from './common/cache/cache.module';
import { AuthGuard } from './common/guard/auth.guard';
import { OauthMiddleware } from './common/middleware/oauth.middleware';
import { QiniuModule } from './common/qiniu/qiniu.module';
import { PictureModule } from './picture/picture.module';
import { UserModule } from './user/user.module';
import { ViewsModule } from './views/views.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    RenderModule,
    ClientModule,
    AuthModule,
    OauthModule,
    PictureModule,
    QiniuModule,
    UserModule,
    ViewsModule,
    CacheModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .forRoutes('*');
  }
}
