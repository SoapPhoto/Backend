/* eslint-disable no-undef */
import {
  Entity, ManyToMany, Column, PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/modules/picture/picture.entity';
import { Expose, Type } from 'class-transformer';

@Entity('tag')
export class TagEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  /** tag名称 */
  @Column({
    readonly: true,
    unique: true,
    length: 120,
    collation: 'utf8mb4_unicode_ci',
  })
  public readonly name!: string;

  @ManyToMany(() => PictureEntity, item => item.tags)
  public readonly pictures!: PictureEntity[];

  @Type(() => Number)
  @Expose()
  public pictureCount = 0;
}
