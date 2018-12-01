import { RefreshToken } from '@entities/RefreshToken';
import { DeepPartial, EntityRepository, Repository, SaveOptions, UpdateResult } from 'typeorm';

export interface IRefreshTokenInput {
  client: any;
  user: any;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
  public add = async (input: IRefreshTokenInput): Promise<Partial<RefreshToken>> => {
    const refreshToken = new RefreshToken();
    refreshToken.client = input.client;
    refreshToken.user = input.user;
    refreshToken.refreshToken = input.refreshToken;
    refreshToken.expires = input.refreshTokenExpiresAt;
    return this.save(refreshToken);
  }
}
