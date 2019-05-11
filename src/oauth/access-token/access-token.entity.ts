import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { UserEntity } from '@server/user/user.entity';
import { ClientEntity } from '../client/client.entity';

@Entity('accessToken')
export class AccessTokenEntity extends BaseEntity {
  @PrimaryColumn({
    primary: true,
    nullable: false,
  })
  public readonly accessToken!: string;

  @PrimaryColumn({
    primary: true,
    nullable: false,
  })
  public readonly refreshToken!: string;

  @Column()
  public readonly accessTokenExpiresAt!: Date;

  @Column()
  public readonly refreshTokenExpiresAt!: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  public readonly user!: UserEntity;

  @ManyToOne(() => ClientEntity)
  @JoinColumn()
  public readonly client!: ClientEntity;
}
