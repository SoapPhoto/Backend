import {
  Exclude, Expose, Transform, Type,
} from 'class-transformer';
import {
  Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEmail, ValidateIf } from 'class-validator';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/modules/picture/picture.entity';

import { CollectionEntity } from '@server/modules/collection/collection.entity';
import { CommentEntity } from '@server/modules/comment/comment.entity';
import { transformAvatar } from '@server/common/utils/transform';
import { PictureUserActivityEntity } from '@server/modules/picture/user-activity/user-activity.entity';
import { SignupType } from '@common/enum/signupType';
import { Status } from '@common/enum/userStatus';
import { Role } from './enum/role.enum';
import { CredentialsEntity } from '../credentials/credentials.entity';
import { BadgeEntity } from '../badge/badge.entity';

@Exclude()
@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  public readonly id!: number;

  /** 用户名 */
  @Expose()
  @PrimaryColumn({
    readonly: true,
    unique: true,
    length: 40,
  })
  public readonly username!: string;

  /** 用户类型 */
  @Exclude()
  @Column({ type: 'enum', enum: Role, default: `${Role.USER}` })
  public role!: Role;

  /** 显示的名称 */
  @Column({
    nullable: true,
    collation: 'utf8mb4_unicode_ci',
  })
  @Expose()
  public name!: string;

  /** 识别码:一般是邮箱 */
  @Column({
    nullable: true,
  })
  @Expose({ groups: [Role.ADMIN] })
  public identifier!: string;

  /** 邮箱验证的随机验证码 */
  @Column({
    nullable: true,
  })
  @Expose({ groups: [Role.ADMIN] })
  public verificationToken!: string;

  @Column({ type: 'enum', enum: Status, default: `${Status.UNVERIFIED}` })
  @Expose({ groups: [Role.OWNER, Role.ADMIN] })
  public status!: Status;

  /** 注册的类型 */
  @Column({ type: 'enum', enum: SignupType, default: `${SignupType.EMAIL}` })
  @Expose({ groups: [Role.OWNER, Role.ADMIN] })
  public signupType!: SignupType;

  /** 邮箱 */
  @ValidateIf(o => !!o.email)
  @IsEmail()
  @Column({
    unique: false,
    default: '',
  })
  @Expose({ groups: [Role.OWNER, Role.ADMIN] })
  @Transform((value?: string) => {
    if (value) {
      const m = value.match(/^(.*)@/);
      if (m && m.length > 1) {
        const left = m[1];
        const { length } = m[1];
        const sliceLength = length > 4 ? 4 : (length - 2) > 1 ? length - 2 : 1;
        return value.replace(left, `${left.slice(0, sliceLength)}****`);
      }
    }
    return value;
  }, { toPlainOnly: true })
  public readonly email!: string;

  /** 密码验证 */
  @Column({ nullable: true })
  @Expose({ groups: [Role.ADMIN] })
  public hash!: string;

  /** 密码盐 */
  @Column({ nullable: true })
  @Expose({ groups: [Role.ADMIN] })
  public readonly salt!: string;

  /** 用户头像 */
  @Transform(transformAvatar)
  @Column({
    default: `${process.env.CDN_URL}/default.svg`,
  })
  @Expose()
  public avatar!: string;

  /** 个人介绍 */
  @Column({
    nullable: true,
  })
  @Expose()
  public bio!: string;

  /** 个人网站 */
  @Column({
    nullable: true,
  })
  @Expose()
  public website!: string;

  /** 用户的picture */
  @OneToMany(() => PictureEntity, photo => photo.user)
  @Expose()
  public readonly pictures!: PictureEntity[];

  /** 用户的评论 */
  @OneToMany(() => PictureEntity, photo => photo.user, { onDelete: 'CASCADE' })
  @Expose()
  public readonly comments!: CommentEntity[];

  /** 用户的收藏夹 */
  @OneToMany(() => CollectionEntity, collection => collection.user)
  @Expose()
  public readonly collections!: CollectionEntity[];

  /** 用户的绑定用户  */
  @OneToMany(() => CredentialsEntity, credentials => credentials.user, { onDelete: 'CASCADE' })
  @Expose()
  public readonly credentials!: CredentialsEntity[];

  /** 用户的picture操作 */
  @OneToMany(() => PictureUserActivityEntity, activity => activity.user)
  public readonly pictureActivities!: PictureUserActivityEntity[];

  @Expose()
  public badge: BadgeEntity[] = [];

  @Type(() => Boolean)
  @Column({ type: 'boolean', default: false })
  @Expose({ groups: [Role.OWNER, Role.ADMIN] })
  public isEmailVerified!: boolean;

  /** 是否关注0:未关注1:已关注2:互相关注 */
  @Type(() => Number)
  @Expose()
  public isFollowing = 0;

  /** 喜欢的picture数量 */
  @Type(() => Number)
  @Expose()
  public likedCount = 0;

  /** 用户被喜欢的数量 */
  @Type(() => Number)
  @Expose()
  public likesCount = 0;

  /** 用户的picture数量 */
  @Type(() => Number)
  @Expose()
  public pictureCount = 0;

  /** 粉丝数量 */
  @Type(() => Number)
  @Expose()
  public followerCount = 0;

  /** 关注数量 */
  @Type(() => Number)
  @Expose()
  public followedCount = 0;

  public isVerified() {
    return this.status === Status.VERIFIED;
  }

  public isActive() {
    return this.status === Status.UNVERIFIED || this.status === Status.VERIFIED;
  }

  @Expose()
  get fullName(): string {
    return this.name || this.username;
  }

  @Expose({ groups: [Role.OWNER] })
  get isPassword() {
    return !!(this.salt && this.hash);
  }
}
