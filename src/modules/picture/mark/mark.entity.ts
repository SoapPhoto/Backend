import {
  Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { PictureMarkType } from '@common/enum/picture';
import { PictureEntity } from '../picture.entity';

@Entity('picture_mark')
export class PictureMarkEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  /** 类型 */
  @Column({
    default: PictureMarkType.USER,
    type: 'varchar',
  })
  public readonly type!: PictureMarkType;

  @ManyToOne(() => PictureEntity)
  public readonly picture!: PictureEntity;

  @Column()
  public readonly x!: number;

  @Column()
  public readonly y!: number;

  @Column()
  public readonly position!: number;
}
