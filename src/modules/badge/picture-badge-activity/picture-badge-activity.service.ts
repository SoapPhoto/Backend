import { Injectable, BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@server/modules/user/user.entity';
import { plainToClass } from 'class-transformer';
import { PictureBadgeActivityEntity } from './picture-badge-activity.entity';
import { BadgeEntity } from '../badge.entity';

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

  public async findByIds(ids: readonly number[]) {
    const data = await this.activityRepository.query(`
      SELECT
        pictureBadge.* ,
        pictureBadgeActivity.pictureId as pictureId
      FROM
        picture picture
        LEFT JOIN LATERAL ( SELECT * FROM picture_badge_activity WHERE pictureId = picture.id LIMIT 3 ) pictureBadgeActivity ON pictureBadgeActivity.pictureId = picture.id
        LEFT JOIN badge pictureBadge ON pictureBadgeActivity.badgeId = pictureBadge.id 
      WHERE
        picture.id IN ( ${ids.join()} ) AND picture.isPrivate=0 AND picture.deleted=0 AND pictureBadge.id IS NOT NULL
    `);

    const badgeMap: Record<string, BadgeEntity[]> = {};
    data.forEach((badge: any) => {
      if (badgeMap[badge.pictureId]) {
        badgeMap[badge.pictureId].push(badge);
      } else {
        badgeMap[badge.pictureId] = [badge];
      }
    });
    return plainToClass(BadgeEntity, ids.map(id => plainToClass(BadgeEntity, badgeMap[id] || [])));
  }
}
