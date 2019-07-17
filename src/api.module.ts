import { Module } from '@nestjs/common';
import { ClientModule } from '@server/oauth/client/client.module';
import { CollectionModule } from './collection/collection.module';
import { CommentModule } from './comment/comment.module';
import { InstagramModule } from './instagram/instagram.module';
import { NotificationModule } from './notification/notification.module';
import { PictureModule } from './picture/picture.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';

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
