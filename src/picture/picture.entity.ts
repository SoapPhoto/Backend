import { Type } from 'class-transformer';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { TagEntity } from '@server/tag/tag.entity';
import { UserEntity } from '@server/user/user.entity';
import { IEXIF } from './picture.interface';
import { PictureUserActivityEntity } from './user-activity/user-activity.entity';

@Entity('picture')
export class PictureEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  /** 七牛的key */
  @Column()
  public readonly key!: string;

  /** 七牛的hash */
  @Column()
  public readonly hash!: string;

  /** 图片标题 */
  @Column({
    nullable: true,
  })
  public readonly title!: string;

  /** 图片介绍 */
  @Column({
    nullable: true,
  })
  public readonly bio!: string;

  /** 浏览次数 */
  @Column({
    default: 0,
  })
  public views!: number;

  /** 图片原始文件名 */
  @Column()
  public readonly originalname!: string;

  /** 图片类型 */
  @Column()
  public readonly mimetype!: string;

  /** 图片大小 */
  @Column()
  public readonly size!: number;
  /** 当前登录用户是否喜欢 */
  @Type(() => Boolean)
  public isLike: boolean = false;

  /** picture喜欢的数量 */
  @Type(() => Number)
  public likes: number = 0;

  /** 图片的主色调 */
  @Column()
  public readonly color!: string;

  /** 图片的颜色是明还是暗 */
  @Type(() => Boolean)
  @Column()
  public readonly isDark!: boolean;

  /** 图片长度 */
  @Type(() => Number)
  @Column()
  public readonly height!: number;

  /** 图片宽度 */
  @Type(() => Number)
  @Column()
  public readonly width!: number;

  /** 设备品牌 */
  @Column({ nullable: true })
  public readonly make?: string;

  /** 设备型号 */
  @Column({ nullable: true })
  public readonly model?: string;

  /** EXIF信息 */
  @Column('simple-json', {
    nullable: true,
  })
  public readonly exif?: IEXIF;

  /** 图片作者 */
  @Type(() => UserEntity)
  @ManyToOne(() => UserEntity, user => user.pictures)
  public readonly user!: UserEntity;

  @OneToMany(() => PictureUserActivityEntity, activity => activity.picture)
  public readonly activitys!: PictureUserActivityEntity[];

  /* tagId */
  @ManyToMany(type => TagEntity, tag => tag.pictures, { onDelete: 'CASCADE', cascade: true })
  @JoinTable()
  public tags!: TagEntity[];
}
