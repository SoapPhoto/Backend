import { Exclude, Expose, Type } from 'class-transformer';
import {
  Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { UserEntity } from '@server/modules/user/user.entity';
import { PictureEntity } from '@server/modules/picture/picture.entity';
import { Role } from '@server/modules/user/enum/role.enum';
import { CollectionPictureEntity } from './picture/collection-picture.entity';

@Exclude()
@Entity('collection')
export class CollectionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  public readonly id!: string;

  /** 收藏夹名字 */
  @Column({
    nullable: true,
  })
  @Expose()
  public readonly name!: string;

  /** 收藏介绍 */
  @Column({
    nullable: true,
  })
  @Expose()
  public readonly bio!: string;

  /** 收藏夹是否是私人 */
  @Column({
    default: false,
  })
  @Expose({ groups: [Role.ADMIN, Role.OWNER] })
  public readonly isPrivate!: boolean;

  /** 收藏夹作者 */
  @Type(() => UserEntity)
  @ManyToOne(() => UserEntity, user => user.collections, { onDelete: 'CASCADE', eager: true })
  @Expose()
  public readonly user!: UserEntity;

  /* 收藏信息 */
  @OneToMany(() => CollectionPictureEntity, picture => picture.collection, { onDelete: 'CASCADE' })
  public info!: CollectionPictureEntity[];

  @Expose()
  @Type(() => PictureEntity)
  get preview() {
    return this.info ? this.info.map(info => info.picture) : [];
  }

  /** 用户的picture数量 */
  @Type(() => Number)
  @Expose()
  public pictureCount = 0;
}
