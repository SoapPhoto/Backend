import { OauthStateType } from '@common/enum/oauthState';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

@Exclude()
export class OauthQueryDto {
  @Expose()
  @IsString()
  public code!: string;

  @Expose()
  @IsEnum(OauthStateType)
  public state!: OauthStateType;
}
