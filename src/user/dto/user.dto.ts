import {
  IsEmail, IsOptional, IsString, IsUrl, Length,
} from 'class-validator';

import { IsUserName } from '@server/common/validator';
import { Exclude, Expose } from 'class-transformer';
import { UserEntity } from '../user.entity';

/**
 * 注册管道
 *
 * @export
 * @class CreateUserDto
 */
@Exclude()
export class CreateUserDto {
  /**
   * 邮箱
   *
   * @type {string}
   * @memberof CreateUserDto
   */
  @IsEmail()
  @Expose()
  public readonly email!: string;

  /**
   * 用户名
   *
   * @type {string}
   * @memberof CreateUserDto
   */
  @Length(1, 15)
  @IsString()
  @IsUserName()
  @Expose()
  public readonly username!: string;

  /**
   * 密码
   *
   * @type {string}
   * @memberof CreateUserDto
   */
  @Length(8, 30)
  @IsString()
  @Expose()
  public readonly password!: string;
}

/**
 * 修改用户信息管道
 *
 * @export
 * @class UpdateProfileSettingDto
 */
@Exclude()
export class UpdateProfileSettingDto implements Partial<UserEntity> {
  /** 昵称 */
  @IsString()
  @Expose()
  public readonly name!: string;

  /** 个人简介 */
  @IsOptional()
  @IsString()
  @Expose()
  public readonly bio!: string;

  /** 个人网站 */
  @IsOptional()
  @IsUrl()
  @Expose()
  public readonly website!: string;
}
