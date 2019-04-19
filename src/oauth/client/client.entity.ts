import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/common/base.entity';

@Entity('client')
export class ClientEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ length: 80, nullable: false })
  public readonly secret: string;

  @Column('simple-array', {
    nullable: false,
  })
  public readonly grants: string[] = ['authorization_code', 'password'];

  @Column({ nullable: false, default: 3600 })
  public readonly accessTokenLifetime: number;

  @Column({ nullable: false, default: 7200 })
  public readonly refreshTokenLifetime: number;
}
