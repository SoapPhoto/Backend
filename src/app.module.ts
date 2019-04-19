import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/auth/auth.module';
import { ClientModule } from '@/oauth/client/client.module';
import { OauthModule } from '@/oauth/oauth.module';
import { LoggingInterceptor } from '@/shared/logging.interceptor';

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
export class AppModule {}
