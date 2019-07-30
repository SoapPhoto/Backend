import {
  Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/picture/picture.entity';
import { CollectionEntity } from '../collection.entity';

@Entity('collection_picture')
export class CollectionPictureEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  /* 收藏 */
  @ManyToOne(() => CollectionEntity, { onDelete: 'CASCADE', cascade: true })
  @JoinTable()
  public collection!: CollectionEntity;

  /* 图片 */
  @ManyToOne(() => PictureEntity, { onDelete: 'CASCADE', cascade: true })
  @JoinTable()
  public picture!: PictureEntity;
}
