import { Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';

@Entity('option')
export class OptionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: number;
}
