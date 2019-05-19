import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/picture/picture.entity';

@Entity('tag')
export class TagEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  /** tag名称 */
  @PrimaryColumn({
    readonly: true,
    unique: true,
    length: 120,
  })
  public readonly name!: string;

  @ManyToMany(type => PictureEntity, item => item.tags)
  public readonly pictures!: PictureEntity[];
}
