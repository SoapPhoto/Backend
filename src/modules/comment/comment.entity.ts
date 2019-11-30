import {
  Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany,
} from 'typeorm';
import { Expose, Exclude, Type } from 'class-transformer';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/modules/picture/picture.entity';
import { UserEntity } from '@server/modules/user/user.entity';

@Exclude()
@Entity('picture_comment')
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  public readonly id!: string;

  @Column({
    collation: 'utf8mb4_unicode_ci',
  })
  @Expose()
  public content!: string;

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

  // 评论的评论
  @ManyToOne(() => CommentEntity, { onDelete: 'CASCADE' })
  @Expose()
  public readonly replyComment!: CommentEntity;

  // // 所有评论
  // @OneToMany(() => CommentEntity, comment => comment.parentComment, { onDelete: 'CASCADE' })
  // @Expose()
  // public readonly childComment!: CommentEntity[];

  // 评论的用户
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', cascade: true })
  @Expose()
  public readonly replyUser!: UserEntity;

  @Type(() => Number)
  @Expose()
  public subCount = 0;

  public childComments!: CommentEntity[];
}
