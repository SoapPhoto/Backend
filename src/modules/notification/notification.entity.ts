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
  public mediaId?: number;

  @Column({ type: 'enum', enum: NotificationType, default: `${NotificationType.USER}` })
  @Expose()
  public readonly type!: NotificationType;

  @OneToMany(() => NotificationSubscribersUserEntity, item => item.notification)
  @Expose()
  public readonly subscribers!: NotificationSubscribersUserEntity[];

  @Expose()
  public media?: PictureEntity | CommentEntity | CollectionEntity | UserEntity;

  @Expose()
  get comment(): CommentEntity | undefined {
    if (this.category === NotificationCategory.REPLY || this.category === NotificationCategory.COMMENT) {
      return this.media as CommentEntity;
    }
    return undefined;
  }

  @Expose()
  get picture(): PictureEntity | undefined {
    if (this.category === NotificationCategory.LIKED) {
      return this.media as PictureEntity;
    }
    return undefined;
  }

  @Expose()
  get user(): UserEntity | undefined {
    if (this.category === NotificationCategory.FOLLOW) {
      return this.media as UserEntity;
    }
    return undefined;
  }

  @Type(() => Boolean)
  @Expose()
  public read = false
}
