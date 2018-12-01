import { AccessToken } from '@entities/AccessToken';
import { DeepPartial, EntityRepository, Repository, SaveOptions, UpdateResult } from 'typeorm';

export interface IAccessTokenInput {
  client: any;
  user: any;
  accessToken: string;
  accessTokenExpiresAt: Date;
}

@EntityRepository(AccessToken)
export class AccessTokenRepository extends Repository<AccessToken> {
  public add = async (input: IAccessTokenInput): Promise<Partial<AccessToken>> => {
    const accessToken = new AccessToken();
    accessToken.client = input.client;
    accessToken.user = input.user;
    accessToken.accessToken = input.accessToken;
    accessToken.expires = input.accessTokenExpiresAt;
    return this.save(accessToken);
  }
}
