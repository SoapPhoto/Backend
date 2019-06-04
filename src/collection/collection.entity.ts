import { Type } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/picture/picture.entity';
import { UserEntity } from '@server/user/user.entity';

@Entity('collection')
export class CollectionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  @Column({
    unique: true,
  })
  public readonly name!: string;

  /** 收藏介绍 */
  @Column({
    nullable: true,
  })
  public readonly bio!: string;

  @Column({
    default: false,
  })
  public readonly isPrivate!: boolean;

  /** 收藏夹作者 */
  @Type(() => UserEntity)
  @ManyToOne(() => UserEntity, user => user.collections, { eager: true })
  public readonly user!: UserEntity;

  /* 图片 */
  @ManyToMany(type => PictureEntity, picture => picture.collections, { onDelete: 'CASCADE', cascade: true })
  @JoinTable()
  public pictures!: PictureEntity[];
}
