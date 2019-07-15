import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { NotificationController } from './notification.controller';
import { NotificationEntity } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationSubscribersUserEntity } from './subscribers-user/subscribers-user.entity';
import { SubscribersUserModule } from './subscribers-user/subscribers-user.module';

@Module({
  providers: [NotificationService],
  controllers: [NotificationController],
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, NotificationSubscribersUserEntity]),
    SubscribersUserModule,
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
