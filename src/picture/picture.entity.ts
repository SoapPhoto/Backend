import { Type } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/common/base.entity';
import { UserEntity } from '@/user/user.entity';
import { PictureUserActivityEntity } from './user-activity/user-activity.entity';

@Entity('picture')
export class PictureEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public readonly key: string;

  @Column()
  public readonly hash: string;

  @Column()
  public readonly originalname: string;

  @Column()
  public readonly mimetype: string;

  @Column()
  public readonly size: number;

  @ManyToOne(() => UserEntity, user => user.pictures)
  public readonly user: UserEntity;

  @OneToMany(() => PictureUserActivityEntity, activity => activity.picture)
  public readonly activitys: PictureUserActivityEntity[];

  @Type(() => Boolean)
  public isLike: boolean = false;

  @Type(() => Number)
  public likes: number;

}
