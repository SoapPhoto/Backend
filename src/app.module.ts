import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MailerModule } from '@nestjs-modules/mailer';
import { RavenModule, RavenInterceptor } from 'nest-raven';

import { AuthModule } from '@server/modules/auth/auth.module';
import { OauthModule } from '@server/modules/oauth/oauth.module';
import { LoggingInterceptor } from '@server/shared/logging/logging.interceptor';
import { ApiModule } from './api.module';
import { EmailModule } from './shared/email/email.module';
import { LoggingModule } from './shared/logging/logging.module';
import { QiniuModule } from './shared/qiniu/qiniu.module';
import { EventsModule } from './events/events.module';

import { OauthMiddleware } from './common/middleware/oauth.middleware';
import { MjmlAdapter } from './common/email/adapters/mjml.adapter';
import ormconfig from './ormconfig';
import { GraphqlService } from './shared/graphql/graphql.service';
import { IpModule } from './shared/ip/ip.module';
import { OssModule } from './shared/oss/oss.module';
import { BlurhashModule } from './shared/blurhash/blurhash.module';
import { DataLoaderInterceptor } from './shared/graphql/loader/loader.interceptor';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

// const dev = process.env.NODE_ENV !== 'production';
// const dev = false;

@Module({
  imports: [
    // CacheModule.register({
    //   store: redisStore,
    //   host: process.env.REDIS_HOST,
    //   port: Number(process.env.REDIS_PORT),
    //   db: Number(process.env.REDIS_DB),
    //   password: process.env.REDIS_PASSWORD,
    //   keyPrefix: process.env.REDIS_PREFIX,
    //   ttl: 20, // seconds
    //   max: 1000, // max number of items in cache
    // }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        db: Number(process.env.REDIS_DB),
        password: process.env.REDIS_PASSWORD,
        keyPrefix: process.env.REDIS_PREFIX,
      },
    }),
    TypeOrmModule.forRoot(ormconfig),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GraphqlService,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: `smtps://${process.env.EMAIL_USER}:${process.env.EMAIL_PASS}@${process.env.EMAIL_HOST}`,
        defaults: {
          from: '"soap" <4049310@qq.com>',
        },
        template: {
          dir: `${process.cwd()}/common/email/template`,
          adapter: new MjmlAdapter(), // or new PugAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    RavenModule,
    LoggingModule,
    AuthModule,
    OauthModule,
    ApiModule,
    EmailModule,
    QiniuModule,
    OssModule,
    IpModule,
    EventsModule,
    BlurhashModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(),
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL });
  }
}
