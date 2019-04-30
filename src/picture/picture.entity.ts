import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { Maybe } from '@server/typing';
import { UserEntity } from '@server/user/user.entity';
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

  @Type(() => UserEntity)
  @ManyToOne(() => UserEntity, user => user.pictures)
  public readonly user: UserEntity;

  @OneToMany(() => PictureUserActivityEntity, activity => activity.picture)
  public readonly activitys: PictureUserActivityEntity[];

  @Type(() => Boolean)
  public isLike: boolean = false;

  @Type(() => Number)
  public likes: number;

  @Column()
  public readonly color: string;

  @Type(() => Boolean)
  @Column()
  public readonly isDark: boolean;

  @Type(() => Number)
  @Column()
  public readonly height: number;

  @Type(() => Number)
  @Column()
  public readonly width: number;

  @Column({ nullable: true })
  public readonly make?: string;

  @Column({ nullable: true })
  public readonly model?: string;

  @Column('simple-json', {
    nullable: true,
  })
  public readonly exif: {
    aperture?: number;
    exposureTime?: string;
    focalLength?: number;
    iso?: number;
    gps?: [number, number];
  };

}
