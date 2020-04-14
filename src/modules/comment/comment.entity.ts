import {
  Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose, Exclude, Type } from 'class-transformer';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/modules/picture/picture.entity';
import { UserEntity } from '@server/modules/user/user.entity';
import { Role } from '../user/enum/role.enum';

@Exclude()
@Entity('picture_comment')
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  public readonly id!: number;

  @Column({
    collation: 'utf8mb4_unicode_ci',
  })
  @Expose()
  public content!: string;

  @Column({
    nullable: true,
  })
  @Expose({ groups: [Role.ADMIN] })
  public ip!: string;

  @Column('simple-json', {
    nullable: true,
  })
  @Expose()
  public ip_location!: Record<string, string>;

  @Column({
    nullable: true,
  })
  @Expose()
  public userAgent!: string;

  @ManyToOne(() => UserEntity, user => user.comments, { cascade: true })
  @Expose()
  public readonly user!: UserEntity;

  @ManyToOne(() => PictureEntity, item => item.comments, { onDelete: 'CASCADE' })
  @Expose()
  public readonly picture!: PictureEntity;

  // 评论的评论
  @ManyToOne(() => CommentEntity, { onDelete: 'CASCADE' })
  @Expose()
  public readonly parentComment!: CommentEntity;

  // 回复的评论
  @ManyToOne(() => CommentEntity, { onDelete: 'CASCADE' })
  @Expose()
  public readonly replyComment!: CommentEntity;

  // 评论的用户
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', cascade: true })
  @Expose()
  public readonly replyUser!: UserEntity;

  @Type(() => Number)
  @Expose()
  public subCount = 0;

  public childComments: CommentEntity[] = [];
}
