
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { ClientModule } from '@server/oauth/client/client.module';
import { AuthGuard } from './common/guard/auth.guard';
import { QiniuModule } from './common/qiniu/qiniu.module';
import { PictureModule } from './picture/picture.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ClientModule,
    PictureModule,
    QiniuModule,
    UserModule,
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
