import { Module } from '@nestjs/common';
import { BaiduService } from './baidu.service';

@Module({
  providers: [BaiduService],
  exports: [BaiduService],
})
export class BaiduModule {}
