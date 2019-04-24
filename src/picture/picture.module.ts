import { QiniuModule } from '@/common/qiniu/qiniu.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PictureController } from './picture.controller';
import { PictureEntity } from './picture.entity';
import { PictureService } from './picture.service';
import { PictureUserActivityModule } from './user-activity/user-activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PictureEntity]),
    QiniuModule,
    PictureUserActivityModule,
  ],
  providers: [PictureService],
  controllers: [PictureController],
  exports: [PictureService],
})
export class PictureModule {}
