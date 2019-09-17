import { Exclude, Expose, Type } from 'class-transformer';
import {
  Entity, BaseEntity, PrimaryColumn, Column, ManyToOne,
} from 'typeorm';

import { CredentialsType } from '@common/enum/credentials';
import { UserEntity } from '../user/user.entity';

@Exclude()
@Entity('user_credentials')
export class CredentialsEntity extends BaseEntity {
  @PrimaryColumn()
  @Expose()
  public readonly id!: string;

  @Expose()
  @Column({ type: 'enum', enum: CredentialsType })
  public type!: CredentialsType;

  @Type(() => UserEntity)
  @ManyToOne(() => UserEntity, user => user.pictures, { onDelete: 'CASCADE' })
  @Expose()
  public readonly user!: UserEntity;

  @Column('simple-json', {
    nullable: true,
  })
  @Expose()
  public readonly info?: any;

  @Expose()
  get isActive() {
    return !!this.user;
  }
}
