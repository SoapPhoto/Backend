import { Type, Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CommentEntity } from '@server/modules/comment/comment.entity';
import { BaseEntity } from '@server/common/base.entity';
import { TagEntity } from '@server/modules/tag/tag.entity';
import { UserEntity } from '@server/modules/user/user.entity';
import { CollectionPictureEntity } from '@server/modules/collection/picture/collection-picture.entity';
import { PictureUserActivityEntity } from './user-activity/user-activity.entity';

@Exclude()
@Entity('picture')
export class PictureEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  public readonly id!: number;

  /** 七牛的key */
  @Column()
  @Expose()
  public readonly key!: string;

  /** 七牛的hash */
  @Column()
  @Expose()
  public readonly hash!: string;

  /** 图片标题 */
  @Column({
    nullable: true,
  })
  @Expose()
  public readonly title!: string;

  /** 图片介绍 */
  @Column({
    nullable: true,
  })
  @Expose()
  public readonly bio!: string;

  @Column({
    default: false,
  })
  public readonly isPrivate!: boolean;

  /** 浏览次数 */
  @Column({
    default: 0,
  })
  @Expose()
  public views!: number;

  /** 图片原始文件名 */
  @Column()
  public readonly originalname!: string;

  /** 图片类型 */
  @Column()
  public readonly mimetype!: string;

  /** 图片大小 */
  @Column()
  @Expose()
  public readonly size!: number;

  /** 当前登录用户是否喜欢 */
  @Type(() => Boolean)
  @Expose()
  public isLike: boolean = false;

  /** picture喜欢的数量 */
  @Type(() => Number)
  @Expose()
  public likes: number = 0;

  /** 图片的主色调 */
  @Column()
  public readonly color!: string;

  /** 图片的颜色是明还是暗 */
  @Type(() => Boolean)
  @Column()
  @Expose()
  public readonly isDark!: boolean;

  /** 图片长度 */
  @Type(() => Number)
  @Column()
  @Expose()
  public readonly height!: number;

  /** 图片宽度 */
  @Type(() => Number)
  @Column()
  @Expose()
  public readonly width!: number;

  /** 设备品牌 */
  @Column({ nullable: true })
  @Expose()
  public readonly make?: string;

  /** 设备型号 */
  @Column({ nullable: true })
  @Expose()
  public readonly model?: string;

  /** EXIF信息 */
  @Column('simple-json', {
    nullable: true,
  })
  @Expose()
  public readonly exif?: IEXIF;

  /** 图片作者 */
  @Type(() => UserEntity)
  @ManyToOne(() => UserEntity, user => user.pictures, { eager: true })
  @Expose()
  public readonly user!: UserEntity;

  /** 图片的评论 */
  @OneToMany(() => PictureEntity, photo => photo.user, { onDelete: 'CASCADE', cascade: true })
  @Expose()
  public readonly comments!: CommentEntity[];

  @OneToMany(() => PictureUserActivityEntity, activity => activity.picture)
  @Expose()
  public readonly activitys!: PictureUserActivityEntity[];

  /* tagId */
  @ManyToMany(() => TagEntity, tag => tag.pictures, { onDelete: 'CASCADE', cascade: true })
  @JoinTable({ name: 'picture_tags' })
  @Expose()
  public tags!: TagEntity[];

  info!: CollectionPictureEntity[]

  @Expose()
  get currentCollections() {
    if (this.info && this.info.length > 0) {
      return this.info.map(item => item.collection);
    }
    return [];
  }
}
