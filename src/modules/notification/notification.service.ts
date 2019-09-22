import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { EventsGateway } from '@server/events/events.gateway';
import { UserEntity } from '@server/modules/user/user.entity';
import { NotificationCategory } from '@common/enum/notification';
import { plainToClass } from 'class-transformer';
import { NotificationEntity } from './notification.entity';
import { NotificationSubscribersUserEntity } from './subscribers-user/subscribers-user.entity';
import { PictureService } from '../picture/picture.service';

@Injectable()
export class NotificationService {
  constructor(
    private wss: EventsGateway,
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(NotificationSubscribersUserEntity)
    private subscribersUserRepository: Repository<NotificationSubscribersUserEntity>,
    @Inject(forwardRef(() => PictureService))
    private readonly pictureService: PictureService,
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
    this.wss.emitUserMessage(subscribers, 'message', {
      event: 'message',
      data: notification,
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
      .getMany();
    console.log(data);
    return Promise.all(
      data.map(async (notify) => {
        let media;
        switch (notify.category) {
          case NotificationCategory.LIKED:
            media = await this.pictureService.getRawOne(notify.mediaId!);
            break;
          default:
        }
        return plainToClass(NotificationEntity, {
          ...notify,
          media,
        });
      }),
    );
  }
}
