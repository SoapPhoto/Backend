import { Injectable } from '@nestjs/common';

import { getTokenExpiresAt } from '@server/common/utils/token';
import { UserEntity } from '@server/user/user.entity';
import { UserService } from '@server/user/user.service';
import { AccessTokenEntity } from '../access-token/access-token.entity';
import { AccessTokenService } from '../access-token/access-token.service';
import { ClientEntity } from '../client/client.entity';
import { ClientService } from '../client/client.service';

// tslint:disable-next-line: no-var-requires
const OAuth2Server = require('oauth2-server');

@Injectable()
export class OauthServerService {
  public server: any;
  constructor(
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly accessTokenService: AccessTokenService,
  ) {
    this.server = new OAuth2Server({
      model: {
        getClient: this.getClient,
        saveToken: this.saveToken,
        getAccessToken: this.getAccessToken,
        getRefreshToken: this.getRefreshToken,
        verifyScope: this.verifyScope,
        revokeToken: this.revokeToken,
        getUser: this.getUser,
      },
    });
  }
  private getClient = async (clientId: string, clientSecret: string) => {
    const client = await this.clientService.getOne(clientId, clientSecret);
    return client;
  }
  private saveToken = async ({ accessToken, refreshToken }: any, client: ClientEntity, user: UserEntity) => {
    const token = {
      client,
      user,
      accessToken,
      refreshToken,
      accessTokenExpiresAt: getTokenExpiresAt(client.accessTokenLifetime),
      refreshTokenExpiresAt: getTokenExpiresAt(client.refreshTokenLifetime),
    };
    const newToken = await this.accessTokenService.create(token);
    return newToken;
  }
  private getAccessToken = async (token: string) => {
    return this.accessTokenService.getAccessToken(token);
  }
  private getRefreshToken = async (refreshToken: string) => {
    return this.accessTokenService.getRefreshToken(refreshToken);
  }
  private revokeToken = async (token: AccessTokenEntity) => {
    if (token) {
      if (token.refreshTokenExpiresAt >= new Date()) {
        return true;
      }
    }
    return false;
  }
  private verifyScope = async () => {
    return true;
  }
  private getUser = async (email: string, password: string) => {
    const user = await this.userService.verifyUser(email, password);
    return user;
  }
}
