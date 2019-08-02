import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationModule } from '@server/modules/notification/notification.module';
import { PictureUserActivityEntity } from './user-activity.entity';
import { PictureUserActivityService } from './user-activity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PictureUserActivityEntity]),
    NotificationModule,
  ],
  providers: [PictureUserActivityService],
  exports: [PictureUserActivityService],
})
export class PictureUserActivityModule {}
