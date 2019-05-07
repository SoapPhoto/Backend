
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { UserEntity } from '@server/user/user.entity';
import { NotificationEntity } from '../notification.entity';

@Entity('notification_subscribers_user')
@Index(['user'])
@Index(['notification'])
export class NotificationSubscribersUserEntity extends BaseEntity {
  @PrimaryGeneratedColumn() public id: number;
  /** 是否已读 */
  @Column({ default: false })
  public read: boolean;

  @ManyToOne(type => NotificationEntity)
  @JoinColumn()
  public notification: NotificationEntity;

  @ManyToOne(type => UserEntity)
  @JoinColumn()
  public user: UserEntity;
}
