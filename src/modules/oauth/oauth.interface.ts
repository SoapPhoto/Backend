import { OauthType } from './enum/oauth-type.enum';
import { IGithubUserInfo } from '../user/user.interface';

export interface IGithubCode {
  type: OauthType.GITHUB;
  data: IGithubUserInfo;
}
