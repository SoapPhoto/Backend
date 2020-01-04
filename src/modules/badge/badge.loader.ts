import DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';

import { INestDataLoader } from '@server/shared/graphql/loader/loader.interceptor';
import { BadgeService } from './badge.service';
import { BadgeEntity } from './badge.entity';
import { PictureBadgeActivityService } from './picture-badge-activity/picture-badge-activity.service';

@Injectable()
export class BadgeUserLoader implements INestDataLoader<number, BadgeEntity> {
  constructor(
    private readonly badgeService: BadgeService,
  ) { }

  public generateDataLoader(): DataLoader<number, BadgeEntity> {
    return new DataLoader<number, BadgeEntity>(keys => console.log(keys) as any);
  }
}

@Injectable()
export class BadgePictureLoader implements INestDataLoader<number, BadgeEntity> {
  constructor(
    private readonly pictureBadgeActivityService: PictureBadgeActivityService,
  ) { }

  public generateDataLoader(): DataLoader<number, BadgeEntity> {
    return new DataLoader<number, BadgeEntity>(keys => this.pictureBadgeActivityService.findByIds(keys));
  }
}
