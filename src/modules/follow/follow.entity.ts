/* eslint-disable no-undef */
import {
  Entity, PrimaryColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { Expose, Type } from 'class-transformer';
import { UserEntity } from '../user/user.entity';
import { Role } from '../user/enum/role.enum';

@Entity('follow')
export class FollowEntity extends BaseEntity {
  @Expose({ groups: [Role.ADMIN] })
  @PrimaryColumn({ type: 'int' })
  public readonly followed_user_id!: ID;

  @Expose({ groups: [Role.ADMIN] })
  @PrimaryColumn({ type: 'int' })
  public readonly follower_user_id!: ID;

  @Type(() => UserEntity)
  @Expose()
  public readonly followed!: UserEntity;

  @Type(() => UserEntity)
  @Expose()
  public readonly follower!: UserEntity;
}
