import { Module } from '@nestjs/common';
import { ClientModule } from '@server/modules/oauth/client/client.module';
import { InstagramModule } from './modules/instagram/instagram.module';
import { CommentModule } from './modules/comment/comment.module';
import { CollectionModule } from './modules/collection/collection.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PictureModule } from './modules/picture/picture.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ClientModule,
    PictureModule,
    UserModule,
    NotificationModule,
    InstagramModule,
    TagModule,
    CollectionModule,
    CommentModule,
  ],
  exports: [
    ClientModule,
    PictureModule,
    UserModule,
  ],
})
export class ApiModule {}
