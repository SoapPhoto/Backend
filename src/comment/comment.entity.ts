import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/picture/picture.entity';
import { UserEntity } from '@server/user/user.entity';

@Entity('picture_comment')
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  @ManyToOne(() => UserEntity, user => user.comments)
  public readonly user!: UserEntity;

  @ManyToOne(() => PictureEntity, item => item.comments)
  public readonly picture!: PictureEntity;
}
