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

  /**
   * 七牛的key
   *
   * @type {string}
   * @memberof PictureEntity
   */
  @Column()
  public readonly key: string;

  /**
   * 七牛的hash
   *
   * @type {string}
   * @memberof PictureEntity
   */
  @Column()
  public readonly hash: string;

  /**
   *
   *
   * @type {string}
   * @memberof PictureEntity
   */
  @Column()
  public readonly originalname: string;

  @Column()
  public readonly mimetype: string;

  /**
   * 图片大小
   *
   * @type {number}
   * @memberof PictureEntity
   */
  @Column()
  public readonly size: number;

  /**
   * 图片的用户
   *
   * @type {UserEntity}
   * @memberof PictureEntity
   */
  @Type(() => UserEntity)
  @ManyToOne(() => UserEntity, user => user.pictures)
  public readonly user: UserEntity;

  @OneToMany(() => PictureUserActivityEntity, activity => activity.picture)
  public readonly activitys: PictureUserActivityEntity[];

  /**
   * 当前登录用户是否喜欢
   *
   * @type {boolean}
   * @memberof PictureEntity
   */
  @Type(() => Boolean)
  public isLike: boolean = false;

  /**
   * picture喜欢的数量
   *
   * @type {number}
   * @memberof PictureEntity
   */
  @Type(() => Number)
  public likes: number;

  /**
   * 图片的主色调
   *
   * @type {string}
   * @memberof PictureEntity
   */
  @Column()
  public readonly color: string;

  /**
   * 图片的颜色是明还是暗
   *
   * @type {boolean}
   * @memberof PictureEntity
   */
  @Type(() => Boolean)
  @Column()
  public readonly isDark: boolean;

  /**
   * 图片长度
   *
   * @type {number}
   * @memberof PictureEntity
   */
  @Type(() => Number)
  @Column()
  public readonly height: number;

  /**
   * 图片宽度
   *
   * @type {number}
   * @memberof PictureEntity
   */
  @Type(() => Number)
  @Column()
  public readonly width: number;

  /**
   * 设备品牌
   *
   * @type {string}
   * @memberof PictureEntity
   */
  @Column({ nullable: true })
  public readonly make?: string;

  /**
   * 设备型号
   *
   * @type {string}
   * @memberof PictureEntity
   */
  @Column({ nullable: true })
  public readonly model?: string;

  /**
   * EXIF信息
   *
   * @type {{
   *     aperture?: number;
   *     exposureTime?: string;
   *     focalLength?: number;
   *     iso?: number;
   *     gps?: [number, number];
   *   }}
   * @memberof PictureEntity
   */
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
