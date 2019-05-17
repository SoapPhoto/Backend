import { Exclude, Transform, Type } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/picture/picture.entity';
import { IsEmail } from 'class-validator';

import { transformAvatar } from '@server/common/utils/transform';
import { PictureUserActivityEntity } from '@server/picture/user-activity/user-activity.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: number;
  /** 用户名 */
  @PrimaryColumn({
    readonly: true,
    unique: true,
    length: 15,
  })
  public readonly username!: string;

  /** 显示的名称 */
  @Column()
  public readonly name!: string;

  /** 邮箱 */
  @IsEmail()
  @Column({
    unique: true,
  })
  public readonly email!: string;

  /** 密码验证 */
  @Exclude()
  @Column()
  public hash!: string;

  /** 密码盐 */
  @Exclude()
  @Column()
  public readonly salt!: string;

  /** 用户类型 */
  @Exclude()
  @Column({
    default: 'user',
  })
  public readonly role!: string;

  /** 用户头像 */
  @Transform(transformAvatar)
  @Column({
    default: `${process.env.CDN_URL}/default.svg`,
  })
  public readonly avatar!: string;

  /** 个人介绍 */
  @Column()
  public readonly bio!: string;

  /** 个人网站 */
  @Column()
  public readonly website!: string;

  /** 用户的picture */
  @OneToMany(type => PictureEntity, photo => photo.user)
  public readonly pictures!: PictureEntity[];

  /** 用户的picture操作 */
  @OneToMany(() => PictureUserActivityEntity, activity => activity.user)
  public readonly pictureActivitys!: PictureUserActivityEntity[];

  /** 喜欢的picture数量 */
  @Type(() => Number)
  public likes: number = 0;

  /** 用户的picture数量 */
  @Type(() => Number)
  public pictureCount: number = 0;
}
