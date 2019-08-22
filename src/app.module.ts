
import {
  MiddlewareConsumer, Module, NestModule, RequestMethod, CacheModule,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from 'express';
import { GraphQLError } from 'graphql';
import { RedisModule } from 'nestjs-redis';
import { MailerModule } from '@nest-modules/mailer';
import redisStore from 'cache-manager-redis-store';

import { AuthModule } from '@server/modules/auth/auth.module';
import { OauthModule } from '@server/modules/oauth/oauth.module';
import { LoggingInterceptor } from '@server/shared/logging/logging.interceptor';
import { ApiModule } from './api.module';
import { EmailModule } from './shared/email/email.module';
import { LoggingModule } from './shared/logging/logging.module';

import { CollectionEntity } from './modules/collection/collection.entity';
import { CollectionPictureEntity } from './modules/collection/picture/collection-picture.entity';
import { CommentEntity } from './modules/comment/comment.entity';
import { OauthMiddleware } from './common/middleware/oauth.middleware';
import { EventsModule } from './events/events.module';
import { NotificationEntity } from './modules/notification/notification.entity';
import { NotificationSubscribersUserEntity } from './modules/notification/subscribers-user/subscribers-user.entity';
import { AccessTokenEntity } from './modules/oauth/access-token/access-token.entity';
import { ClientEntity } from './modules/oauth/client/client.entity';
import { PictureEntity } from './modules/picture/picture.entity';
import { PictureUserActivityEntity } from './modules/picture/user-activity/user-activity.entity';
import { Logger } from './shared/logging/logging.service';
import { QiniuModule } from './shared/qiniu/qiniu.module';
import { TagEntity } from './modules/tag/tag.entity';
import { UserEntity } from './modules/user/user.entity';
import { MjmlAdapter } from './common/email/adapters/mjml.adapter';
import { FileEntity } from './modules/file/file.entity';

// const dev = process.env.NODE_ENV !== 'production';
// const dev = false;


@Module({
  imports: [
    // NestNextModule.forRoot({ dev }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      db: Number(process.env.REDIS_DB),
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.REDIS_PRIFIX,
      ttl: 20, // seconds
      max: 1000, // max number of items in cache
    }),
    RedisModule.register({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      db: Number(process.env.REDIS_DB),
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.REDIS_PRIFIX,
    }),
    TypeOrmModule.forRoot({
      logging: false,
      keepConnectionAlive: true,
      type: 'mysql',
      port: Number(process.env.DATABASE_PORT),
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true, // TODO: Remove in production!
      entities: [
        UserEntity,
        PictureEntity,
        ClientEntity,
        PictureUserActivityEntity,
        NotificationEntity,
        NotificationSubscribersUserEntity,
        TagEntity,
        AccessTokenEntity,
        CollectionEntity,
        CollectionPictureEntity,
        CommentEntity,
        FileEntity,
      ],
    }),
    GraphQLModule.forRoot({
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
      typePaths: ['./comment/graphql/*.graphql', './**/*.graphql'],
      context: ({ req }: { req: Request }) => ({
        headers: req.headers,
        cookies: req.cookies,
        user: req.user,
      }),
      formatError: (error: GraphQLError) => {
        Logger.error(
          JSON.stringify({
            message: error.message,
            location: error.locations,
            stack: error.stack ? error.stack.split('\n') : [],
            path: error.path,
          }),
        );
        return error;
      },
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: `smtps://${process.env.EMAIL_USER}:${process.env.EMAIL_PASS}@${process.env.EMAIL_HOST}`,
        defaults: {
          from: '"soap" <4049310@qq.com>',
        },
        template: {
          dir: `${__dirname}/common/email/template`,
          adapter: new MjmlAdapter(), // or new PugAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    LoggingModule,
    AuthModule,
    OauthModule,
    ApiModule,
    EmailModule,
    QiniuModule,
    EventsModule,
    // ViewsModule,
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
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL });
  }
}
