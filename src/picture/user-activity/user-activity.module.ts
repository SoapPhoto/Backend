import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PictureUserActivityEntity } from './user-activity.entity';
import { PictureUserActivityService } from './user-activity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PictureUserActivityEntity]),
  ],
  providers: [PictureUserActivityService],
  exports: [PictureUserActivityService],
})
export class PictureUserActivityModule {}
