import { IsEmail, IsString, Length } from 'class-validator';

import { IsUserName } from '@/common/validator';

export class CreateUserDto {

  @IsEmail()
  public readonly email: string;

  @Length(1, 15)
  @IsString()
  @IsUserName()
  public readonly username: string;

  @Length(8, 30)
  @IsString()
  public readonly password: string;
}
