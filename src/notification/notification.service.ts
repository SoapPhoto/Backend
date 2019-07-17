import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { UserEntity } from '@server/user/user.entity';
import { NotificationEntity } from './notification.entity';
import { NotificationGateway } from './notification.gateway';
import { NotificationSubscribersUserEntity } from './subscribers-user/subscribers-user.entity';

@Injectable()
export class NotificationService {
  constructor(
    private wss: NotificationGateway,
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(NotificationSubscribersUserEntity)
    private subscribersUserRepository: Repository<NotificationSubscribersUserEntity>,
  ) {}
  public publishNotification = async (
    publisher: UserEntity,
    subscribers: UserEntity,
    entityManager?: EntityManager,
  ) => {
    try {
      if (entityManager) {
        const notification = await entityManager.save(this.notificationRepository.create({ publisher }));
        await entityManager.save(
          this.subscribersUserRepository.create({ notification, user: subscribers }),
        );
      } else {
        const notification = await this.notificationRepository.save(this.notificationRepository.create({ publisher }));
        await this.subscribersUserRepository.save(
          this.subscribersUserRepository.create({ notification, user: subscribers }),
        );
      }
      this.wss.emitMessage('notify', {});
    } catch (err) {
      throw err;
    }
  }
}
