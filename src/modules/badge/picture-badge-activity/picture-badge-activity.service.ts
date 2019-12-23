import { Injectable, BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@server/modules/user/user.entity';
import { PictureBadgeActivityEntity } from './picture-badge-activity.entity';

@Injectable()
export class PictureBadgeActivityService {
  constructor(
    @InjectRepository(PictureBadgeActivityEntity)
    private activityRepository: Repository<PictureBadgeActivityEntity>,
  ) {}

  get metadata() {
    return this.activityRepository.metadata;
  }

  public async isExist(badgeId: number, pictureId: number) {
    return !!await this.activityRepository.findOne({ badgeId, pictureId });
  }

  public async addBadge(user: UserEntity, badgeId: number, pictureId: number) {
    if (await this.isExist(badgeId, pictureId)) throw new BadGatewayException('badge_exist');
    return this.activityRepository.save(
      this.activityRepository.create({
        badgeId,
        pictureId,
        createUserId: user.id,
      }),
    );
  }
}
