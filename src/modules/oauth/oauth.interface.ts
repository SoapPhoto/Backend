import { OauthType } from './enum/oauth-type.enum';
import { IGithubUserInfo, IGoogleUserInfo } from '../user/user.interface';

export interface IGithubCode {
  type: OauthType.GITHUB;
  data: IGithubUserInfo;
}

export interface IGoogleCode {
  type: OauthType.GITHUB;
  data: IGoogleUserInfo;
}
