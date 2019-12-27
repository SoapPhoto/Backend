import { Injectable, BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@server/modules/user/user.entity';
import { UserBadgeActivityEntity } from './user-badge-activity.entity';

@Injectable()
export class UserBadgeActivityService {
  constructor(
    @InjectRepository(UserBadgeActivityEntity)
    private activityRepository: Repository<UserBadgeActivityEntity>,
  ) {}

  get metadata() {
    return this.activityRepository.metadata;
  }

  public async isExist(badgeId: number, userId: number) {
    return !!await this.activityRepository.findOne({ badgeId, userId });
  }

  public async addBadge(user: UserEntity, badgeId: number, userId: number) {
    if (await this.isExist(badgeId, userId)) throw new BadGatewayException('badge_exist');
    return this.activityRepository.save(
      this.activityRepository.create({
        badgeId,
        userId,
        createUserId: user.id,
      }),
    );
  }
}
