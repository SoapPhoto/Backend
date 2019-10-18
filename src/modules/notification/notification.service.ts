import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';

import { EventsGateway } from '@server/events/events.gateway';
import { UserEntity } from '@server/modules/user/user.entity';
import { NotificationCategory } from '@common/enum/notification';
import { plainToClass, classToPlain } from 'class-transformer';
import { NotificationEntity } from './notification.entity';
import { NotificationSubscribersUserEntity } from './subscribers-user/subscribers-user.entity';
import { PictureService } from '../picture/picture.service';
import { SubscribersUserService } from './subscribers-user/subscribers-user.service';

export const pubSub = new PubSub();

@Injectable()
export class NotificationService {
  public pubSub = new PubSub();

  constructor(
    private wss: EventsGateway,
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(NotificationSubscribersUserEntity)
    private subscribersUserRepository: Repository<NotificationSubscribersUserEntity>,
    @Inject(forwardRef(() => PictureService))
    private readonly pictureService: PictureService,
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
    await this.pubSub.publish('newNotification', { newNotification: notification, subscribers });
    this.wss.emitUserMessage(subscribers, 'message', {
      event: 'message',
      data: classToPlain(notification),
    });
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
      .getMany();
    return Promise.all(
      data.map(async notify => classToPlain(plainToClass(NotificationEntity, {
        ...notify,
        media: await this.setNotificationItemMedia(notify),
      }))),
    );
  }

  public setNotificationItemMedia = async (notify: NotificationEntity) => {
    if (
      notify.category === NotificationCategory.LIKED
      || notify.category === NotificationCategory.COMMENT
    ) {
      return this.pictureService.getRawOne(notify.mediaId!);
    }
    return undefined;
  }

  public getUnReadCount = async (user: UserEntity) => this.notificationRepository.createQueryBuilder('notification')
    .leftJoin('notification.subscribers', 'subscribers')
    .where('subscribers.userId=:userId AND subscribers.read=0', { userId: user.id })
    .getCount()

  public unReadAll = async (user: UserEntity) => {
    await this.subscribersService.unReadAll(user);
  }
}
