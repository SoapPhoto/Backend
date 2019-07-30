import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, getManager, Repository } from 'typeorm';

import { validator } from '@server/common/utils/validator';
import { NotificationService } from '@server/notification/notification.service';
import { UserEntity } from '@server/user/user.entity';

import Maybe from 'graphql/tsutils/Maybe';
import { GetPictureListDto } from '../dto/picture.dto';
import { PictureEntity } from '../picture.entity';
import { PictureUserActivityEntity } from './user-activity.entity';

@Injectable()
export class PictureUserActivityService {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(PictureUserActivityEntity)
    private activityRepository: Repository<PictureUserActivityEntity>,
  ) {}

  public getOne = async (pictureId: ID, userId: ID) => this.activityRepository.createQueryBuilder('activity')
    .where('activity.pictureId=:pictureId', { pictureId })
    .leftJoinAndSelect('activity.user', 'user')
    .leftJoinAndSelect('activity.picture', 'picture')
    .andWhere('activity.userId=:userId', { userId })
    .getOne()

  public like = async (
    picture: PictureEntity,
    user: UserEntity,
  ) => {
    const activity = await this.getOne(picture.id, user.id);
    await getManager().transaction(async (entityManager) => {
      if (activity) {
        await entityManager.save(
          this.activityRepository.merge(activity, {
            like: !activity.like,
            ...!activity.like ? {
              likedTime: new Date(),
            } : {},
          }),
        );
      } else {
        await entityManager.save(
          this.activityRepository.create({
            picture,
            user,
            like: true,
            likedTime: new Date(),
          }),
        );
      }
    });
    if (!activity || activity.like) {
      this.notificationService.publishNotification(user, picture.user);
    }
    return {
      isLike: activity ? activity.like : false,
      count: await this.activityRepository.count({ picture, like: true }),
    };
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

  public deleteByPicture = async (picture: PictureEntity, entityManager: EntityManager) => entityManager
    .createQueryBuilder()
    .delete()
    .from(PictureUserActivityEntity)
    .where('pictureId=:id', { id: picture.id })
    .execute()

  public getLikeList = async (userIdOrName: string, query: GetPictureListDto, user: Maybe<UserEntity>) => {
    const getQ = (isCount = false) => {
      let isMe = false;
      let type = '';
      const q = this.activityRepository.createQueryBuilder('activity')
        .select(
          ...(
            isCount
              ? ['COUNT(DISTINCT(`pictureId`))', 'count']
              : ['DISTINCT(`pictureId`)', 'id']
          ) as [string, string],
        )
        .where('activity.like=:like', { like: true });
      if (validator.isNumberString(userIdOrName)) {
        type = 'userId';
        if (user && user.id === userIdOrName) isMe = true;
      } else {
        type = 'userUsername';
        if (user && user.username === userIdOrName) isMe = true;
      }
      q.andWhere(`activity.${type}=:id`, { id: userIdOrName });
      if (isMe) {
        const qO = '(picture.isPrivate = 1 OR picture.isPrivate = 0)';
        q.leftJoin('activity.picture', 'picture')
          .andWhere(`((picture.${type}=:id AND ${qO}) OR picture.isPrivate = 0)`, {
            id: userIdOrName,
          });
      } else {
        q.leftJoin('activity.picture', 'picture')
          .andWhere('picture.isPrivate = 0');
      }
      if (!isCount) {
        q.skip((query.page - 1) * query.pageSize).take(query.pageSize);
      }
      return q;
    };
    // 分页
    const [count, data] = await Promise.all([
      getQ(true).getRawOne(),
      getQ().getRawMany(),
    ]);
    return [count.count, data.map(activity => activity.id as string)];
  }
}
