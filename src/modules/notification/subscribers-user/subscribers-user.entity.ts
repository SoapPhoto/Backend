
import {
  Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { UserEntity } from '@server/modules/user/user.entity';
import { NotificationEntity } from '../notification.entity';

@Entity('notification_subscribers_user')
@Index(['user'])
@Index(['notification'])
export class NotificationSubscribersUserEntity extends BaseEntity {
  @PrimaryGeneratedColumn() public id!: number;

  /** 是否已读 */
  @Column({ type: 'bool', default: false })
  public read = false;

  @ManyToOne(() => NotificationEntity)
  @JoinColumn()
  public notification!: NotificationEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  public user!: UserEntity;
}
