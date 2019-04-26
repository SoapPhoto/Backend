import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { UserEntity } from '@server/user/user.entity';
import { PictureEntity } from '../picture.entity';
import { PictureUserActivityEntity } from './user-activity.entity';

@Injectable()
export class PictureUserActivityService {
  constructor(
    @InjectRepository(PictureUserActivityEntity)
    private activityRepository: Repository<PictureUserActivityEntity>,
  ) {}

  public getOne = async (pictureId: string | number, userId: string | number) => {
    return this.activityRepository.createQueryBuilder('activity')
      .where('activity.pictureId=:pictureId', { pictureId })
      .leftJoinAndSelect('activity.user', 'user')
      .leftJoinAndSelect('activity.picture', 'picture')
      .andWhere('activity.userId=:userId', { userId })
      .getOne();
  }

  public like = async (
    picture: PictureEntity,
    user: UserEntity,
  ) => {
    const activity = await this.getOne(picture.id, user.id);
    if (activity) {
      await this.activityRepository.save(
        this.activityRepository.merge(activity, {
          like: !activity.like,
          ...!activity.like ? {
            likedTime: new Date(),
          } : {},
        }),
      );
    } else {
      await this.activityRepository.save(
        this.activityRepository.create({
          picture,
          user,
          like: true,
          likedTime: new Date(),
        }),
      );
    }
    return this.activityRepository.count({ picture, like: true });
  }

  public setInfo = async (
    data: Partial<PictureUserActivityEntity>,
    picture: PictureEntity,
    user: UserEntity,
  ) => {
    const activity = await this.getOne(picture.id, user.id);
    if (activity) {
      return this.activityRepository.save(
        this.activityRepository.merge(activity, data),
      );
    }
    return this.activityRepository.save(
      this.activityRepository.create(data),
    );
  }
  public deleteByPicture = async (picture: PictureEntity, entityManager: EntityManager) => {
    return entityManager
      .createQueryBuilder()
      .delete()
      .from(PictureUserActivityEntity)
      .where('pictureId=:id', { id: picture.id })
      .execute();
  }
}
