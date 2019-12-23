import {
  Entity, PrimaryGeneratedColumn, Column, PrimaryColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';

@Entity('picture_badge_activity')
export class PictureBadgeActivityEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @PrimaryColumn({ type: 'int' })
  public readonly badgeId!: number;

  @PrimaryColumn({ type: 'int' })
  public readonly pictureId!: number;

  @Column({ type: 'int' })
  public readonly createUserId!: number;
}
