import { OauthStateType } from '@common/enum/oauthState';

export class OauthQueryDto {
  public code!: string;

  public state!: OauthStateType;
}
