import {
  MiddlewareConsumer, Module, NestModule, forwardRef,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { EventsModule } from '@server/events/events.module';
import { NotificationController } from './notification.controller';
import { NotificationEntity } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationSubscribersUserEntity } from './subscribers-user/subscribers-user.entity';
import { SubscribersUserModule } from './subscribers-user/subscribers-user.module';
import { PictureModule } from '../picture/picture.module';

@Module({
  providers: [NotificationService],
  controllers: [NotificationController],
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, NotificationSubscribersUserEntity]),
    SubscribersUserModule,
    EventsModule,
    forwardRef(() => PictureModule),
  ],
  exports: [NotificationService],
})
export class NotificationModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .forRoutes(NotificationController);
  }
}
