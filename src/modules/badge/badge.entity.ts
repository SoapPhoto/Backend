import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { BaseEntity } from '@server/common/base.entity';
import { BadgeType, BadgeRate } from '@common/enum/badge';

@Exclude()
@Entity('badge')
export class BadgeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  public readonly id!: number;

  @Column({ type: 'enum', enum: BadgeType, default: `${BadgeType.PICTURE}` })
  @Expose()
  public readonly type!: BadgeType;

  @Column()
  @Expose()
  public readonly name!: string;

  @Column({ type: 'varchar', nullable: true })
  @Expose()
  public readonly rate!: BadgeRate;
}
