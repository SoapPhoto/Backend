import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/picture/picture.entity';
import { IsEmail, ValidateIf } from 'class-validator';

import { CollectionEntity } from '@server/collection/collection.entity';
import { CommentEntity } from '@server/comment/comment.entity';
import { transformAvatar } from '@server/common/utils/transform';
import { PictureUserActivityEntity } from '@server/picture/user-activity/user-activity.entity';

type SignupType = 'email' | 'oauth';

@Exclude()
@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  public readonly id!: string;

  /** 用户名 */
  @Expose()
  @PrimaryColumn({
    readonly: true,
    unique: true,
    length: 15,
  })
  public readonly username!: string;

  /** 显示的名称 */
  @Column({
    nullable: true,
  })
  @Expose()
  public readonly name!: string;

  /** 是否验证 */
  @Column({ default: false })
  @Expose({ groups: ['admin'] })
  public readonly verified!: boolean;

  /** 识别码:一般是邮箱 */
  @Column({
    nullable: true,
  })
  @Expose({ groups: ['admin'] })
  public readonly identifier!: string;

  /** 邮箱验证的随机验证码 */
  @Column({
    nullable: true,
  })
  @Expose({ groups: ['admin'] })
  public readonly verificationToken!: string;

  /** 注册的类型 */
  @Column({
    default: 'email',
  })
  @Expose()
  public readonly signupType!: SignupType;

  /** 邮箱 */
  @ValidateIf(o => !!o.email)
  @IsEmail()
  @Column({
    unique: false,
  })
  @Expose()
  public readonly email!: string;

  /** 密码验证 */
  @Column()
  @Expose({ groups: ['admin'] })
  public hash!: string;

  /** 密码盐 */
  @Column()
  @Expose({ groups: ['admin'] })
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
  @Expose()
  public readonly avatar!: string;

  /** 个人介绍 */
  @Column({
    nullable: true,
  })
  @Expose()
  public readonly bio!: string;

  /** 个人网站 */
  @Column({
    nullable: true,
  })
  @Expose()
  public readonly website!: string;

  /** 用户的picture */
  @OneToMany(type => PictureEntity, photo => photo.user)
  @Expose()
  public readonly pictures!: PictureEntity[];

  /** 用户的评论 */
  @OneToMany(type => PictureEntity, photo => photo.user, { onDelete: 'CASCADE', cascade: true })
  @Expose()
  public readonly comments!: CommentEntity[];

  /** 用户的收藏夹 */
  @OneToMany(type => CollectionEntity, collection => collection.user)
  @Expose()
  public readonly collections!: CollectionEntity[];

  /** 用户的picture操作 */
  @OneToMany(() => PictureUserActivityEntity, activity => activity.user)
  public readonly pictureActivitys!: PictureUserActivityEntity[];

  /** 喜欢的picture数量 */
  @Type(() => Number)
  @Expose()
  public likes: number = 0;

  /** 用户的picture数量 */
  @Type(() => Number)
  @Expose()
  public pictureCount: number = 0;
}
