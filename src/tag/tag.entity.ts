import { Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';

@Entity('tag')
export class TagEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

}
