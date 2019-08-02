import {
  Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { UserEntity } from '@server/modules/user/user.entity';
import { PictureEntity } from '../picture.entity';

@Entity('picture_user_activity')
export class PictureUserActivityEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @ManyToOne(() => UserEntity)
  public readonly user!: UserEntity;

  @ManyToOne(() => PictureEntity, { onDelete: 'CASCADE', cascade: true })
  public readonly picture!: PictureEntity;

  @Column({ default: false })
  public readonly like: boolean = false;

  @Column()
  public readonly likedTime!: Date;
}
