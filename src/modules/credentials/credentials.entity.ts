import { Exclude, Expose, Type } from 'class-transformer';
import {
  Entity, BaseEntity, PrimaryColumn, Column, ManyToOne,
} from 'typeorm';

import { OauthType } from '@common/enum/router';
import { UserEntity } from '../user/user.entity';
import { IGithubUserInfo, IGoogleUserInfo } from '../user/user.interface';

@Exclude()
@Entity('user_credentials')
export class CredentialsEntity extends BaseEntity {
  @PrimaryColumn()
  @Expose()
  public readonly id!: string;

  @Expose()
  @Column({ type: 'enum', enum: OauthType })
  public type!: OauthType;

  @Type(() => UserEntity)
  @ManyToOne(() => UserEntity, user => user.pictures, { onDelete: 'CASCADE' })
  @Expose()
  public readonly user!: UserEntity;

  @Column('simple-json', {
    nullable: true,
  })
  @Expose()
  public readonly info?: IGithubUserInfo | IGoogleUserInfo;

  @Expose()
  get isActive() {
    return !!this.user;
  }
}
