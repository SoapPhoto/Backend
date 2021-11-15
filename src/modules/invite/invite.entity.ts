import {
  Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { UserEntity } from '../user/user.entity';

@Entity('invite')
export class InviteEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  @PrimaryColumn()
  public readonly code!: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  public user!: UserEntity;
}
