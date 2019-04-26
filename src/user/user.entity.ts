import { Exclude, Type } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/picture/picture.entity';
import { IsEmail } from 'class-validator';

import { PictureUserActivityEntity } from '@server/picture/user-activity/user-activity.entity';

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
  @Column()
  public hash: string;

  @Exclude()
  @Column()
  public readonly salt: string;

  @Exclude()
  @Column({
    default: 'user',
  })
  public readonly role: string;

  @OneToMany(type => PictureEntity, photo => photo.user)
  public readonly pictures: PictureEntity[];

  @OneToMany(() => PictureUserActivityEntity, activity => activity.user)
  public readonly pictureActivitys: PictureUserActivityEntity[];

  @Type(() => Number)
  public likes = 0;

  @Type(() => Number)
  public pictureCount = 0;
}
