import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PictureBadgeActivityService } from './picture-badge-activity.service';
import { PictureBadgeActivityEntity } from './picture-badge-activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PictureBadgeActivityEntity]),
  ],
  providers: [PictureBadgeActivityService],
  exports: [PictureBadgeActivityService],
})
export class PictureBadgeActivityModule {}
