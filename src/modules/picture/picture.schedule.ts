import { Injectable, Inject, forwardRef } from '@nestjs/common';
import {
  Cron, NestSchedule,
} from 'nest-schedule';
import { PictureService } from '@server/modules/picture/picture.service';
import { RedisService } from 'nestjs-redis';
import dayjs from 'dayjs';

@Injectable()
export class PictureScheduleService extends NestSchedule {
  constructor(
    @Inject(forwardRef(() => PictureService))
    private readonly pictureService: PictureService,
    private readonly redisService: RedisService,
  ) {
    super();
  }

  @Cron('0 */3 * * *', { key: 'picture-hot' })
  public async cron() {
    const redisClient = this.redisService.getClient();
    const data = await this.pictureService.getHotPictures();
    await redisClient.zadd('picture_hot', ...data);
    console.log(dayjs().format(), 'picture hot OK!!!!!!!!');
  }
}
