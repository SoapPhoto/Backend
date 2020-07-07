import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { isNumberString } from 'class-validator';

import { NotificationService } from '@server/modules/notification/notification.service';
import { UserEntity } from '@server/modules/user/user.entity';

import Maybe from 'graphql/tsutils/Maybe';
import { NotificationType, NotificationCategory } from '@common/enum/notification';
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

  get metadata() {
    return this.activityRepository.metadata;
  }

  public getOne = async (pictureId: number, userId: number) => this.activityRepository.createQueryBuilder('activity')
    .where('activity.pictureId=:pictureId', { pictureId })
    .leftJoinAndSelect('activity.user', 'user')
    .leftJoinAndSelect('activity.picture', 'picture')
    .andWhere('activity.userId=:userId', { userId })
    .getOne()

  public like = async (
    picture: PictureEntity,
    user: UserEntity,
    data: boolean,
  ) => {
    const activity = await this.getOne(picture.id, user.id);
    if (!activity || activity.like === !data) {
      if (activity) {
        await this.activityRepository.createQueryBuilder()
          .update(PictureUserActivityEntity)
          .set({ like: data })
          .where('id=:id', { id: activity.id })
          .execute();
      } else {
        await this.activityRepository
          .createQueryBuilder()
          .insert()
          .into(PictureUserActivityEntity)
          .values({
            picture,
            user,
            like: data,
            likedTime: new Date(),
          })
          .execute();
      }
      if (picture.user.id !== user.id && data) {
        this.notificationService.publishNotification(
          user,
          picture.user,
          {
            type: NotificationType.USER,
            category: NotificationCategory.LIKED,
            mediaId: picture.id,
          },
        );
      }
      return {
        isLike: data,
        count: await this.activityRepository.count({ picture, like: true }),
      };
    }
    throw new BadRequestException('liked');
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

  public getPicturesLikeCount = async (ids: number[]) => this.activityRepository.createQueryBuilder('activity')
    .select('COUNT(DISTINCT(`activity`.`id`)) as count, activity.pictureId')
    .where('activity.pictureId IN (:...ids) AND activity.like=1', { ids })
    .groupBy('activity.pictureId')
    .getRawMany()

  public getLikes = async (id: number) => this.activityRepository.createQueryBuilder('activity')
    .where('activity.pictureId=:id AND activity.like=1', { id })
    .getCount()

  public isLike = async (id: number, user: UserEntity) => {
    const data = await this.activityRepository.createQueryBuilder('activity')
      .where('activity.pictureId=:id AND activity.userId=:userId', {
        id,
        userId: user.id,
      })
      .getOne();
    return Boolean(data);
  }

  public userLikesCount = async (userId: number) => {
    const data = await this.activityRepository.createQueryBuilder('activity')
      .leftJoin('activity.picture', 'picture')
      .where('picture.userId=:userId AND activity.like=1', { userId })
      .andWhere('picture.deleted = 0')
      .getCount();
    return data;
  }

  public deleteByPicture = async (picture: PictureEntity, entityManager: EntityManager) => entityManager
    .createQueryBuilder()
    .delete()
    .from(PictureUserActivityEntity)
    .where('pictureId=:id', { id: picture.id })
    .execute()

  public getLikeList = async (userIdOrName: string, query: GetPictureListDto, user: Maybe<UserEntity>): Promise<[number, string[]]> => {
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
      if (isNumberString(userIdOrName)) {
        type = 'userId';
        if (user && user.id.toString() === userIdOrName) isMe = true;
      } else {
        type = 'userUsername';
        if (user && user.username === userIdOrName) isMe = true;
      }
      q.andWhere(`activity.${type}=:id`, { id: userIdOrName })
        .leftJoin('activity.picture', 'picture')
        .andWhere('picture.isPrivate = 0');
      if (isMe) {
        const qO = '(picture.isPrivate = 1 OR picture.isPrivate = 0)';
        q
          .andWhere(`((picture.${type}=:id AND ${qO}) OR picture.isPrivate = 0)`, {
            id: userIdOrName,
          });
      } else {
        q
          .andWhere('picture.isPrivate = 0');
      }
      if (!isCount) {
        q
          .addSelect('likedTime')
          .skip((query.page - 1) * query.pageSize).take(query.pageSize)
          .orderBy('activity.likedTime', 'DESC');
      }
      return q;
    };
    // 分页
    const [count, data] = await Promise.all([
      getQ(true).getRawOne(),
      getQ().getRawMany(),
    ]);
    return [count.count as number, data.map((activity: {id: string}) => activity.id)];
  }

  public getPictureLikedCount = async (pictureId: number) => {
    const data = await this.activityRepository.createQueryBuilder('activity')
      .where('activity.pictureId=:pictureId AND activity.like=1', { pictureId })
      .leftJoin('activity.picture', 'picture')
      .andWhere('picture.deleted = 0')
      .getCount();
    return data;
  }

  public getUserLikedCount = async (userId: number) => {
    const data = await this.activityRepository.createQueryBuilder('activity')
      .where('activity.userId=:userId AND activity.like=1', { userId })
      .leftJoin('activity.picture', 'picture')
      .andWhere('picture.deleted = 0')
      .getCount();
    return data;
  }
}
