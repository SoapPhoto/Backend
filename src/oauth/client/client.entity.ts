import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';

@Entity('client')
export class ClientEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string;

  @Column({ length: 80, nullable: false })
  public readonly secret!: string;

  @Column('simple-array', {
    nullable: false,
  })
  public readonly grants: string[] = ['authorization_code', 'password'];

  @Column({ nullable: false, default: 3600 })
  public readonly accessTokenLifetime!: number;

  @Column({ nullable: false, default: 1209600 })
  public readonly refreshTokenLifetime!: number;
}
