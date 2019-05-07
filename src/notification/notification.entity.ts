import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { UserEntity } from '@server/user/user.entity';
import { NotificationSubscribersUserEntity } from './subscribers-user/subscribers-user.entity';

@Entity('notification')
export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn() public id: number;

  /** 消息发布者 */
  @ManyToOne(type => UserEntity)
  @JoinColumn()
  public publisher: UserEntity;

  @OneToMany(type => NotificationSubscribersUserEntity, item => item.notification)
  public subscribers: NotificationSubscribersUserEntity[];
}
