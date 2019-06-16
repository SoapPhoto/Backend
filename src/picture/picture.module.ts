import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { NotificationModule } from '@server/notification/notification.module';
import { QiniuModule } from '@server/shared/qiniu/qiniu.module';
import { TagModule } from '@server/tag/tag.module';
import { UserModule } from '@server/user/user.module';
import { PictureController } from './picture.controller';
import { PictureEntity } from './picture.entity';
import { PictureResolver } from './picture.resolvers';
import { PictureService } from './picture.service';
import { PictureUserActivityModule } from './user-activity/user-activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PictureEntity]),
    QiniuModule,
    NotificationModule,
    PictureUserActivityModule,
    forwardRef(() => TagModule),
    forwardRef(() => UserModule),
  ],
  providers: [PictureService, PictureResolver],
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
