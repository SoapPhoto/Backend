import { Module } from '@nestjs/common';
import { ClientModule } from '@server/oauth/client/client.module';
import { QiniuModule } from './common/qiniu/qiniu.module';
import { NotificationModule } from './notification/notification.module';
import { PictureModule } from './picture/picture.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ClientModule,
    PictureModule,
    QiniuModule,
    UserModule,
    NotificationModule,
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: AuthGuard,
  //   },
  // ],
  exports: [
    ClientModule,
    PictureModule,
    QiniuModule,
    UserModule,
  ],
})
export class ApiModule {}
