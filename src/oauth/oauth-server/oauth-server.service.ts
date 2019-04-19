import { ForbiddenException, Injectable } from '@nestjs/common';
import * as OAuth2Server from 'oauth2-server';

import { getTokenExpiresAt } from '@/common/utils/token';
import { UserEntity } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { ClientEntity } from '../client/client.entity';
import { ClientService } from '../client/client.service';

@Injectable()
export class OauthServerService {
  public server;
  constructor(
    private readonly clientService: ClientService,
    private readonly userService: UserService,
  ) {
    this.server = new OAuth2Server({
      model: {
        getClient: this.getClient,
        saveToken: this.saveToken,
        getAccessToken: this.getAccessToken,
        verifyScope: this.verifyScope,
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
      accessToken,
      refreshToken,
      accessTokenExpiresAt: getTokenExpiresAt(client.accessTokenLifetime),
      refreshTokenExpiresAt: getTokenExpiresAt(client.refreshTokenLifetime),
    };
    console.log('saveToken', token, client, user);
  }
  private getAccessToken = async () => {
    console.log('getAccessToken');
  }
  private verifyScope = async () => {
    console.log('verifyScope');
  }
  private getUser = async (email: string, password: string) => {
    const user = await this.userService.verifyUser(email, password);
    return user;
  }
}
