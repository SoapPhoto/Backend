import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { QiniuModule } from '@server/common/qiniu/qiniu.module';
import { NotificationModule } from '@server/notification/notification.module';
import { TagModule } from '@server/tag/tag.module';
import { PictureController } from './picture.controller';
import { PictureEntity } from './picture.entity';
import { PictureService } from './picture.service';
import { PictureUserActivityModule } from './user-activity/user-activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PictureEntity]),
    QiniuModule,
    NotificationModule,
    PictureUserActivityModule,
    TagModule,
  ],
  providers: [PictureService],
  controllers: [PictureController],
  exports: [PictureService],
})
export class PictureModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .forRoutes(PictureController);
  }
}
