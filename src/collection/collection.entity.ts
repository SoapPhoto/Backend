import { Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';

@Entity('collection')
export class CollectionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

}
