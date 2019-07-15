import { Global, Module } from '@nestjs/common';

import { QiniuService } from './qiniu.service';

@Global()
@Module({
  providers: [QiniuService],
  exports: [QiniuService],
})
export class QiniuModule {}
