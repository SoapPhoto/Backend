import { AuthModule } from '@/auth/auth.module';
import { ClientModule } from '@/oauth/client/client.module';
import { OauthModule } from '@/oauth/oauth.module';
import { LoggingInterceptor } from '@/shared/logging.interceptor';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .forRoutes('*');
  }
}
