import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@server/modules/user/user.entity';
import { NotificationSubscribersUserEntity } from './subscribers-user.entity';

@Injectable()
export class SubscribersUserService {
  constructor(
    @InjectRepository(NotificationSubscribersUserEntity)
    private subscribersRepository: Repository<NotificationSubscribersUserEntity>
  ) {}

  public markNotificationReadAll = async (user: UserEntity) => {
    await this.subscribersRepository
      .createQueryBuilder()
      .update()
      .set({ read: true })
      .where('userId=:id AND read=0', { id: user.id })
      .execute();
  };
}
