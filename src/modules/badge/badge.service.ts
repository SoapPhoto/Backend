import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, Inject, forwardRef } from '@nestjs/common';

import { BadgeType } from '@common/enum/badge';
import { PictureBadgeActivityService } from './picture-badge-activity/picture-badge-activity.service';
import { UserEntity } from '../user/user.entity';
import { BadgeEntity } from './badge.entity';
import { UserBadgeActivityService } from './user-badge-activity/user-badge-activity.service';

@Injectable()
export class BadgeService {
  constructor(
    @Inject(forwardRef(() => PictureBadgeActivityService))
    private readonly pictureBadgeActivityService: PictureBadgeActivityService,
    @Inject(forwardRef(() => UserBadgeActivityService))
    private readonly userBadgeActivityService: UserBadgeActivityService,
    @InjectRepository(BadgeEntity)
    private badgeRepository: Repository<BadgeEntity>
  ) {}

  get pictureActivityMetadata() {
    return this.pictureBadgeActivityService.metadata;
  }

  get userActivityMetadata() {
    return this.userBadgeActivityService.metadata;
  }

  public addBadge(
    user: UserEntity,
    type: BadgeType,
    badgeId: number,
    targetId: number
  ) {
    if (type === BadgeType.PICTURE) {
      return this.pictureBadgeActivityService.addBadge(user, badgeId, targetId);
    }
    return this.pictureBadgeActivityService.addBadge(user, badgeId, targetId);
  }

  public getBadges(type: BadgeType, targetId: number) {
    return this.badgeRepository
      .createQueryBuilder('badge')
      .leftJoin(
        this.pictureBadgeActivityService.metadata.tableName,
        'badgeActivity',
        'badgeActivity.badgeId=badge.id'
      )
      .where('badgeActivity.pictureId=:targetId', { targetId })
      .getMany();
  }
}
