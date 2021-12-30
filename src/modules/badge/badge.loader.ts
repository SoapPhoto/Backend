import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';

import { NestDataLoader } from '@server/shared/graphql/loader/loader.interceptor';
import { BadgeEntity } from './badge.entity';
import { PictureBadgeActivityService } from './picture-badge-activity/picture-badge-activity.service';

@Injectable({ scope: Scope.REQUEST })
export class BadgePictureLoader implements NestDataLoader<number, BadgeEntity> {
  constructor(
    private readonly pictureBadgeActivityService: PictureBadgeActivityService
  ) {}

  public generateDataLoader(): DataLoader<number, BadgeEntity> {
    return new DataLoader<number, BadgeEntity>((keys) =>
      this.pictureBadgeActivityService.findByIds(keys)
    );
  }
}
