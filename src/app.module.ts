import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/auth/auth.module';
import { ClientModule } from '@/oauth/client/client.module';
import { OauthModule } from '@/oauth/oauth.module';
import { LoggingInterceptor } from '@/shared/logging.interceptor';
import { AuthGuard } from './common/guard/auth.guard';
import { OauthMiddleware } from './common/middleware/oauth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ClientModule,
    AuthModule,
    OauthModule,
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
