import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, Inject, forwardRef } from '@nestjs/common';

import { BadgeType } from '@common/enum/badge';
import { PictureBadgeActivityService } from './picture-badge-activity/picture-badge-activity.service';
import { UserEntity } from '../user/user.entity';
import { BadgeEntity } from './badge.entity';

@Injectable()
export class BadgeService {
  constructor(
    @Inject(forwardRef(() => PictureBadgeActivityService))
    private readonly pictureBadgeActivityService: PictureBadgeActivityService,
    @InjectRepository(BadgeEntity)
    private badgeRepository: Repository<BadgeEntity>,
  ) {}

  get pictureActivityMetadata() {
    return this.pictureBadgeActivityService.metadata;
  }


  public addBadge(
    user: UserEntity,
    type: BadgeType,
    badgeId: number,
    targetId: number,
  ) {
    if (type === BadgeType.PICTURE) {
      return this.pictureBadgeActivityService.addBadge(user, badgeId, targetId);
    }
    return this.pictureBadgeActivityService.addBadge(user, badgeId, targetId);
  }

  public getBadges(
    type: BadgeType,
    targetId: number,
  ) {
    return this.badgeRepository.createQueryBuilder('badge')
      .innerJoin(this.pictureBadgeActivityService.metadata.tableName, 'badgeActivity')
      .where('badgeActivity.pictureId=:targetId', { targetId })
      .getMany();
  }
}
