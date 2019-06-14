import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ClientModule } from '@server/oauth/client/client.module';
import { CollectionModule } from './collection/collection.module';
import { AllExceptionFilter } from './common/filter/exception.filter';
import { QiniuModule } from './common/modules/qiniu/qiniu.module';
import { InstagramModule } from './instagram/instagram.module';
import { NotificationModule } from './notification/notification.module';
import { PictureModule } from './picture/picture.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ClientModule,
    PictureModule,
    QiniuModule,
    UserModule,
    NotificationModule,
    InstagramModule,
    TagModule,
    CollectionModule,
  ],
  exports: [
    ClientModule,
    PictureModule,
    QiniuModule,
    UserModule,
  ],
})
export class ApiModule {}
