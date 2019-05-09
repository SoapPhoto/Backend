import { IsEmail, IsString, Length } from 'class-validator';

import { IsUserName } from '@server/common/validator';
/**
 * 注册管道
 *
 * @export
 * @class CreateUserDto
 */
export class CreateUserDto {

  /**
   * 邮箱
   *
   * @type {string}
   * @memberof CreateUserDto
   */
  @IsEmail()
  public readonly email: string;
  /**
   * 用户名
   *
   * @type {string}
   * @memberof CreateUserDto
   */
  @Length(1, 15)
  @IsString()
  @IsUserName()
  public readonly username: string;

  /**
   * 密码
   *
   * @type {string}
   * @memberof CreateUserDto
   */
  @Length(8, 30)
  @IsString()
  public readonly password: string;
}
