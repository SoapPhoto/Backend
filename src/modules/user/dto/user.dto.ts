import {
  IsEmail,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
  isNotEmpty,
  IsInt,
  Max,
  Min,
  IsBoolean,
  IsOptional,
  IsDateString,
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
  @ValidateIf((o) => isNotEmpty(o.bio))
  @IsString()
  @Expose()
  public readonly bio!: string;

  /** 个人网站 */
  @ValidateIf((o) => isNotEmpty(o.website))
  @IsUrl()
  @Expose()
  public readonly website!: string;

  /** 性别 */
  @IsInt()
  @Max(1)
  @Expose()
  public readonly gender!: number;

  /** 性别展示 */
  @IsBoolean()
  @Expose()
  public readonly genderSecret!: boolean;

  @IsOptional()
  @IsDateString()
  @Expose()
  public readonly birthday!: string;

  @IsOptional()
  @IsInt()
  @Max(3)
  @Min(0)
  @Expose()
  public readonly birthdayShow!: number;

  @Expose()
  public readonly key!: string;
}
