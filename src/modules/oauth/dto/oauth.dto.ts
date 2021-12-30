import { OauthStateType } from '@common/enum/oauthState';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { IsUserName } from '@server/common/validator';

@Exclude()
export class OauthQueryDto {
  @Expose()
  @IsString()
  public code!: string;

  @Expose()
  @IsEnum(OauthStateType)
  public state!: OauthStateType;
}

@Exclude()
export class ActiveUserDto {
  @Expose()
  @IsNotEmpty()
  @IsUserName()
  public username!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  public code!: string;

  @Expose()
  @IsString()
  public name!: string;
}
