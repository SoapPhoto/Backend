import {
  Exclude, Expose, Transform, Type,
} from 'class-transformer';
import {
  Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { PictureEntity } from '@server/modules/picture/picture.entity';
import { IsEmail, ValidateIf } from 'class-validator';

import { CollectionEntity } from '@server/modules/collection/collection.entity';
import { CommentEntity } from '@server/modules/comment/comment.entity';
import { transformAvatar } from '@server/common/utils/transform';
import { PictureUserActivityEntity } from '@server/modules/picture/user-activity/user-activity.entity';
import { Role } from './enum/role.enum';
import { Status } from './enum/status.enum';
import { SignupType } from './enum/signup.type.enum';
import { CredentialsEntity } from '../credentials/credentials.entity';

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
  @Expose({ groups: [Role.ADMIN] })
  public status!: Status;

  /** 注册的类型 */
  @Column({ type: 'enum', enum: SignupType, default: `${SignupType.EMAIL}` })
  @Expose({ groups: [Role.ADMIN] })
  public signupType!: SignupType;

  /** 邮箱 */
  @ValidateIf(o => !!o.email)
  @IsEmail()
  @Column({
    unique: false,
    default: '',
  })
  @Expose()
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
  public readonly pictureActivitys!: PictureUserActivityEntity[];

  /** 喜欢的picture数量 */
  @Type(() => Number)
  @Expose()
  public likes = 0;

  /** 用户的picture数量 */
  @Type(() => Number)
  @Expose()
  public pictureCount = 0;

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

  @Expose()
  @Expose({ groups: [Role.OWNER] })
  get isPassword() {
    return !!(this.salt && this.hash);
  }
}
