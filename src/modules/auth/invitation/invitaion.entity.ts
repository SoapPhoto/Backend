import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { UserEntity } from '@server/modules/user/user.entity';

@Entity('auth_invitaion_code')
export class AuthInvitaionCodeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: string;

  @ManyToOne(() => UserEntity, user => user.collections, { eager: true })
  public creator!: UserEntity;

  public key!: string;

  @ManyToOne(() => UserEntity, user => user.collections, { eager: true })
  public user?: UserEntity;
}
