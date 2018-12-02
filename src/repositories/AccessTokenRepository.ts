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
  public getByToken = async (accessToken: string) => {
    return await this.createQueryBuilder('accessToken')
      .where('accessToken.accessToken=:accessToken', { accessToken })
      .leftJoinAndSelect('accessToken.client', 'client')
      .leftJoinAndSelect('accessToken.user', 'user')
      .getOne();
  }

  public delete = async (accessToken: string) => {
    return await this.createQueryBuilder()
    .delete()
    .from(AccessToken)
    .where('accessToken=:accessToken', { accessToken })
    .execute();
  }
}
