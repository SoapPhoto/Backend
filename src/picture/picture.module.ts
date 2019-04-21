import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QiniuModule } from '@/common/qiniu/qiniu.module';
import { PictureController } from './picture.controller';
import { PictureEntity } from './picture.entity';
import { PictureService } from './picture.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PictureEntity]),
    QiniuModule,
  ],
  providers: [PictureService],
  controllers: [PictureController],
})
export class PictureModule {}
