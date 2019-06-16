import { Module } from '@nestjs/common';

import { QiniuService } from './qiniu.service';

@Module({
  providers: [QiniuService],
  exports: [QiniuService],
})
export class QiniuModule {}
