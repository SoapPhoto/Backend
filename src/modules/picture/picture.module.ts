import {
  forwardRef, MiddlewareConsumer, Module, NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentModule } from '@server/modules/comment/comment.module';
import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { NotificationModule } from '@server/modules/notification/notification.module';
import { TagModule } from '@server/modules/tag/tag.module';
import { UserModule } from '@server/modules/user/user.module';
import { PictureController } from './picture.controller';
import { PictureEntity } from './picture.entity';
import { PictureResolver } from './picture.resolvers';
import { PictureService } from './picture.service';
import { PictureUserActivityModule } from './user-activity/user-activity.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PictureEntity]),
    forwardRef(() => NotificationModule),
    forwardRef(() => PictureUserActivityModule),
    forwardRef(() => CommentModule),
    forwardRef(() => TagModule),
    forwardRef(() => UserModule),
    forwardRef(() => FileModule),
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
