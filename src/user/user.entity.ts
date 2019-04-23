import { Exclude } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/common/base.entity';
import { PictureEntity } from '@/picture/picture.entity';
import { IsEmail } from 'class-validator';

import { PictureUserActivityEntity } from '@/picture/user-activity/user-activity.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @PrimaryColumn({
    readonly: true,
    unique: true,
    length: 15,
  })
  public readonly username: string;

  @IsEmail()
  @Column({
    unique: true,
  })
  public readonly email: string;

  @Exclude()
  @Column({ select: false })
  public hash: string;

  @Exclude()
  @Column({ select: false })
  public readonly salt: string;

  @OneToMany(type => PictureEntity, photo => photo.user)
  public readonly pictures: PictureEntity[];

}
