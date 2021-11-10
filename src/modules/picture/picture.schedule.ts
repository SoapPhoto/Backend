import { Injectable, Inject, forwardRef } from '@nestjs/common';
import {
  Cron, NestSchedule,
} from 'nest-schedule';
import { PictureService } from '@server/modules/picture/picture.service';
import { RedisManager } from '@liaoliaots/nestjs-redis';
import dayjs from 'dayjs';

@Injectable()
export class PictureScheduleService extends NestSchedule {
  constructor(
    @Inject(forwardRef(() => PictureService))
    private readonly pictureService: PictureService,
    private readonly redisManager: RedisManager,
  ) {
    super();
  }

  @Cron('0 */1 * * *', { key: 'picture-hot' })
  public async cron() {
    const redisClient = this.redisManager.getClient();
    const data = await this.pictureService.calculateHotPictures();
    await redisClient.zadd('picture_hot', ...data);
    console.log(dayjs().format(), 'picture hot OK!!!!!!!!');
  }
}
