import { Injectable, Inject, forwardRef } from '@nestjs/common';
import {
  Cron, NestSchedule,
} from 'nest-schedule';
import { PictureService } from '@server/modules/picture/picture.service';

@Injectable()
export class PictureScheduleService extends NestSchedule {
  constructor(
    @Inject(forwardRef(() => PictureService))
    private readonly pictureService: PictureService,
  ) {
    super();
  }

  @Cron('0 */3 * * *', { key: 'schedule-cron' })
  public cron() {
    // console.log('executing cron job');
  }
}
