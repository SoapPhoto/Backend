import {
  Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { UserEntity } from '@server/modules/user/user.entity';
import { NotificationSubscribersUserEntity } from './subscribers-user/subscribers-user.entity';

@Entity('notification')
export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn() public id!: number;

  /** 消息发布者 */
  @ManyToOne(() => UserEntity)
  @JoinColumn()
  public publisher!: UserEntity;

  @OneToMany(() => NotificationSubscribersUserEntity, item => item.notification)
  public subscribers!: NotificationSubscribersUserEntity[];
}
