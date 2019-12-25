import { Type, Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { CommentEntity } from '@server/modules/comment/comment.entity';
import { BaseEntity } from '@server/common/base.entity';
import { TagEntity } from '@server/modules/tag/tag.entity';
import { UserEntity } from '@server/modules/user/user.entity';
import { CollectionPictureEntity } from '@server/modules/collection/picture/collection-picture.entity';
import { keyword } from '@server/common/utils/keyword';
import { PictureUserActivityEntity } from './user-activity/user-activity.entity';
import { Role } from '../user/enum/role.enum';
import { CollectionEntity } from '../collection/collection.entity';
import { BadgeEntity } from '../badge/badge.entity';

export interface IRelatedCollections {
  count: number;
  data: CollectionEntity[];
}

@Exclude()
@Entity('picture')
export class PictureEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  public readonly id!: number;

  /** 七牛的key */
  @Column({ unique: true })
  @Expose()
  public readonly key!: string;

  /** 七牛的hash */
  @Column()
  @Expose()
  public readonly hash!: string;

  /** 图片标题 */
  @Column({
    nullable: true,
    collation: 'utf8mb4_unicode_ci',
  })
  @Expose()
  public readonly title!: string;

  /** 图片介绍 */
  @Column({
    nullable: true,
    collation: 'utf8mb4_unicode_ci',
  })
  @Expose()
  public readonly bio!: string;

  @Column({
    default: false,
  })
  @Expose({ groups: [Role.OWNER] })
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
  public isLike = false;

  /** picture喜欢的数量 */
  @Type(() => Number)
  @Expose()
  public likedCount = 0;

  /** 图片评论数量 */
  @Type(() => Number)
  @Expose()
  public commentCount = 0;

  /** 图片的主色调 */
  @Column()
  @Expose()
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
  @OneToMany(() => PictureEntity, photo => photo.user, { onDelete: 'CASCADE' })
  @Expose()
  public readonly comments!: CommentEntity[];

  @OneToMany(() => PictureUserActivityEntity, activity => activity.picture, { onDelete: 'CASCADE' })
  @Expose()
  public readonly activities!: PictureUserActivityEntity[];

  /* tagId */
  @ManyToMany(() => TagEntity, tag => tag.pictures, { onDelete: 'CASCADE', cascade: true })
  @JoinTable({ name: 'picture_tags' })
  @Expose()
  public tags!: TagEntity[];

  @Index({ fulltext: true })
  @Column()
  public keywords!: string;

  @Expose()
  public badge!: BadgeEntity[];

  public info!: CollectionPictureEntity[];

  public relatedCollections!: IRelatedCollections;

  @Expose()
  get currentCollections() {
    if (this.info && this.info.length > 0) {
      return this.info.map(item => item.collection);
    }
    return [];
  }

  // @BeforeInsert()
  // private insertKeyword() {
  //   const tags = keyword([this.title, this.bio]);
  //   this.keywords = keyword([this.title, this.bio]).join('|');
  //   if (this.tags.length > 0) {
  //     tags.unshift(...this.tags.map(tag => tag.name));
  //   }
  //   this.keywords = tags.join('|');
  // }
}
