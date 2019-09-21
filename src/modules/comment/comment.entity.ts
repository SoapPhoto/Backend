import {
  Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/modules/picture/picture.entity';
import { UserEntity } from '@server/modules/user/user.entity';

@Entity('picture_comment')
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  @Column({
    collation: 'utf8mb4_unicode_ci',
  })
  public content!: string;

  @ManyToOne(() => UserEntity, user => user.comments)
  public readonly user!: UserEntity;

  @ManyToOne(() => PictureEntity, item => item.comments)
  public readonly picture!: PictureEntity;
}
