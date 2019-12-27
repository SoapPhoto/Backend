import {
  Entity, PrimaryGeneratedColumn, Column, PrimaryColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';

@Entity('user_badge_activity')
export class UserBadgeActivityEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @PrimaryColumn({ type: 'int' })
  public readonly badgeId!: number;

  @PrimaryColumn({ type: 'int' })
  public readonly userId!: number;

  @Column({ type: 'int' })
  public readonly createUserId!: number;
}
