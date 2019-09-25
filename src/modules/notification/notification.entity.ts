import {
  Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Column,
} from 'typeorm';
import { Expose, Type } from 'class-transformer';

import { BaseEntity } from '@server/common/base.entity';
import { UserEntity } from '@server/modules/user/user.entity';
import { NotificationType, NotificationCategory } from '@common/enum/notification';
import { NotificationSubscribersUserEntity } from './subscribers-user/subscribers-user.entity';
import { PictureEntity } from '../picture/picture.entity';
import { CommentEntity } from '../comment/comment.entity';
import { Role } from '../user/enum/role.enum';
import { CollectionEntity } from '../collection/collection.entity';

@Entity('notification')
export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn() public id!: number;

  /** 消息发布者 */
  @ManyToOne(() => UserEntity, { cascade: true, onDelete: 'SET NULL' })
  @JoinColumn()
  @Expose()
  public readonly publisher!: UserEntity;

  @Column({ type: 'enum', enum: NotificationCategory })
  @Expose()
  public readonly category!: NotificationCategory;

  @Column({ nullable: true })
  @Expose({ groups: [Role.ADMIN] })
  public mediaId?: string;

  @Column({ type: 'enum', enum: NotificationType, default: `${NotificationType.USER}` })
  @Expose()
  public readonly type!: NotificationType;

  @OneToMany(() => NotificationSubscribersUserEntity, item => item.notification)
  @Expose()
  public readonly subscribers!: NotificationSubscribersUserEntity[];

  @Expose()
  public media?: PictureEntity | CommentEntity | CollectionEntity;

  @Type(() => Boolean)
  @Expose()
  public read = false;
}
