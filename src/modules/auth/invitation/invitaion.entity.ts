import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { UserEntity } from '@server/modules/user/user.entity';

@Entity('auth_invitation_code')
export class AuthInvitationCodeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @ManyToOne(() => UserEntity, user => user.collections, { eager: true })
  public creator!: UserEntity;

  public key!: string;

  @ManyToOne(() => UserEntity, user => user.collections, { eager: true })
  public user?: UserEntity;
}
