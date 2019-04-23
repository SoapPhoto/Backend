import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/common/base.entity';
import { UserEntity } from '@/user/user.entity';
import { PictureEntity } from '../picture.entity';

@Entity('picture_user_activity')
export class PictureUserActivityEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @ManyToOne(type => UserEntity)
  public readonly user: UserEntity;

  @ManyToOne(type => PictureEntity)
  public readonly picture: PictureEntity;

  @Column({ default: false })
  public readonly like: boolean;

  @Column()
  public readonly likedTime: Date;
}
