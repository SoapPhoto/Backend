import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { EventsGateway } from '@server/events/events.gateway';
import { UserEntity } from '@server/modules/user/user.entity';
import { NotificationCategory } from '@common/enum/notification';
import { classToPlain } from 'class-transformer';
import { pubSub } from '@server/common/pubSub';
import { NotificationEntity } from './notification.entity';
import { NotificationSubscribersUserEntity } from './subscribers-user/subscribers-user.entity';
import { PictureService } from '../picture/picture.service';
import { SubscribersUserService } from './subscribers-user/subscribers-user.service';
import { CommentService } from '../comment/comment.service';
import { UserService } from '../user/user.service';

@Injectable()
export class NotificationService {
  public pubSub = pubSub;

  constructor(
    private wss: EventsGateway,
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(NotificationSubscribersUserEntity)
    private subscribersUserRepository: Repository<NotificationSubscribersUserEntity>,
    @Inject(forwardRef(() => PictureService))
    private readonly pictureService: PictureService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => SubscribersUserService))
    private readonly subscribersService: SubscribersUserService,
  ) {}

  public publishNotification = async (
    publisher: UserEntity,
    subscribers: UserEntity,
    data: Pick<NotificationEntity, 'type' | 'category' | 'mediaId'>,
    entityManager?: EntityManager,
  ) => {
    let notification: NotificationEntity;
    if (entityManager) {
      notification = await entityManager.save(this.notificationRepository.create({ publisher, ...data }));
      await entityManager.save(
        this.subscribersUserRepository.create({
          notification, user: subscribers,
        }),
      );
    } else {
      notification = await this.notificationRepository.save(this.notificationRepository.create({ publisher, ...data }));
      await this.subscribersUserRepository.save(
        this.subscribersUserRepository.create({
          notification, user: subscribers,
        }),
      );
    }
    notification.media = await this.setNotificationItemMedia(notification);
    await this.pubSub.publish('newNotification', { newNotification: classToPlain(notification), subscribers });
    // this.wss.emitUserMessage(subscribers, 'message', {
    //   event: 'message',
    //   data: classToPlain(notification),
    // });
  }

  public async getList(user: UserEntity) {
    const data = await this.notificationRepository.createQueryBuilder('notification')
      .leftJoin('notification.subscribers', 'subscribers')
      .leftJoinAndSelect('notification.publisher', 'user')
      .where('subscribers.userId=:userId', { userId: user.id })
      .loadRelationCountAndMap(
        'notification.read', 'notification.subscribers', 'subscribers',
        qb => qb.andWhere(
          'subscribers.read=:read',
          { read: true },
        ),
      )
      .orderBy('notification.createTime', 'DESC')
      .limit(20)
      .getMany();
    return Promise.all(
      data.map(async (notify) => {
        notify.media = await this.setNotificationItemMedia(notify);
        return classToPlain(notify);
      }),
    );
  }

  public setNotificationItemMedia = async (notify: NotificationEntity) => {
    if (
      notify.category === NotificationCategory.LIKED
    ) {
      try {
        // 不存在会报错
        return this.pictureService.findOne(notify.mediaId!, null);
      } catch {
        return undefined;
      }
    }
    if (notify.category === NotificationCategory.REPLY
      || notify.category === NotificationCategory.COMMENT) {
      return this.commentService.getRawOne(notify.mediaId!);
    }
    if (notify.category === NotificationCategory.FOLLOW) {
      return this.userService.findOne(notify.mediaId!, null, ['badge']);
    }
    return undefined;
  }

  public getUnReadCount = async (user: UserEntity) => this.notificationRepository.createQueryBuilder('notification')
    .leftJoin('notification.subscribers', 'subscribers')
    .where('subscribers.userId=:userId AND subscribers.read=0', { userId: user.id })
    .getCount()

  public markNotificationReadAll = async (user: UserEntity) => {
    await this.subscribersService.markNotificationReadAll(user);
  }
}
