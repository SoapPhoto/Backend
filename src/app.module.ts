
import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RenderModule } from 'nest-next';

import { AuthModule } from '@server/auth/auth.module';
import { OauthModule } from '@server/oauth/oauth.module';
import { LoggingInterceptor } from '@server/shared/logging/logging.interceptor';
import { ApiModule } from './api.module';
import { CacheModule } from './common/cache/cache.module';
import { EmailModule } from './common/modules/email/email.module';
import { LoggingModule } from './shared/logging/logging.module';
import { ViewsModule } from './views/views.module';

import { Request } from 'express';
import { GraphQLError } from 'graphql';
import { CollectionEntity } from './collection/collection.entity';
import { CollectionPictureEntity } from './collection/picture/collection-picture.entity';
import { OauthMiddleware } from './common/middleware/oauth.middleware';
import { NotificationEntity } from './notification/notification.entity';
import { NotificationSubscribersUserEntity } from './notification/subscribers-user/subscribers-user.entity';
import { AccessTokenEntity } from './oauth/access-token/access-token.entity';
import { ClientEntity } from './oauth/client/client.entity';
import { PictureEntity } from './picture/picture.entity';
import { PictureUserActivityEntity } from './picture/user-activity/user-activity.entity';
import { TagEntity } from './tag/tag.entity';
import { UserEntity } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      logging: true,
      keepConnectionAlive: true,
      type: 'mysql',
      port: 3306,
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
      ],
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
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
    LoggingModule,
    RenderModule,
    AuthModule,
    OauthModule,
    ViewsModule,
    CacheModule,
    ApiModule,
    EmailModule,
    // EventsModule,
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
