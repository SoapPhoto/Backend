import { Exclude, Type } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/picture/picture.entity';
import { IsEmail } from 'class-validator';

import { PictureUserActivityEntity } from '@server/picture/user-activity/user-activity.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: number;
  /**
   * 用户名
   *
   * @type {string}
   * @memberof UserEntity
   */
  @PrimaryColumn({
    readonly: true,
    unique: true,
    length: 15,
  })
  public readonly username!: string;

  /**
   * 显示的名称
   *
   * @type {string}
   * @memberof UserEntity
   */
  @Column()
  public readonly name!: string;

  /**
   * 邮箱
   *
   * @type {string}
   * @memberof UserEntity
   */
  @IsEmail()
  @Column({
    unique: true,
  })
  public readonly email!: string;

  /**
   * 密码验证
   *
   * @type {string}
   * @memberof UserEntity
   */
  @Exclude()
  @Column()
  public hash!: string;

  /**
   * 密码盐
   *
   * @type {string}
   * @memberof UserEntity
   */
  @Exclude()
  @Column()
  public readonly salt!: string;

  /**
   * 用户类型
   *
   * @type {string}
   * @memberof UserEntity
   */
  @Exclude()
  @Column({
    default: 'user',
  })
  public readonly role: string = 'user';

  /**
   * 用户头像
   *
   * @type {string}
   * @memberof UserEntity
   */
  @Exclude()
  @Column({
    default: '//cdn.soapphoto.com/default.svg',
  })
  public readonly avatar: string = '//cdn.soapphoto.com/default.svg';

  /**
   * 用户的picture
   *
   * @type {PictureEntity[]}
   * @memberof UserEntity
   */
  @OneToMany(type => PictureEntity, photo => photo.user)
  public readonly pictures!: PictureEntity[];

  /**
   * 用户的picture操作
   *
   * @type {PictureUserActivityEntity[]}
   * @memberof UserEntity
   */
  @OneToMany(() => PictureUserActivityEntity, activity => activity.user)
  public readonly pictureActivitys!: PictureUserActivityEntity[];

  /**
   * 喜欢的picture数量
   *
   * @type {number}
   * @memberof UserEntity
   */
  @Type(() => Number)
  public likes: number = 0;

  /**
   * 用户的picture数量
   *
   * @type {number}
   * @memberof UserEntity
   */
  @Type(() => Number)
  public pictureCount: number = 0;
}
