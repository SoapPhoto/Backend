import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

import { getTokenExpiresAt } from '@server/common/utils/token';
import { UserEntity } from '@server/modules/user/user.entity';
import { UserService } from '@server/modules/user/user.service';
import { RedisManager } from '@liaoliaots/nestjs-redis';
import { OauthType } from '@common/enum/router';
import { AccessTokenEntity } from '../access-token/access-token.entity';
import { AccessTokenService } from '../access-token/access-token.service';
import { ClientEntity } from '../client/client.entity';
import { ClientService } from '../client/client.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const OAuth2Server = require('oauth2-server');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TokenHandler = require('oauth2-server/lib/handlers/token-handler');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tokenUtil = require('oauth2-server/lib/utils/token-util');

@Injectable()
export class OauthServerService {
  public server: any;

  private getAccessToken = this.accessTokenService.getAccessToken;

  private getRefreshToken = this.accessTokenService.getRefreshToken;

  constructor(
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly accessTokenService: AccessTokenService,
    private readonly redisManager: RedisManager,
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

  public generateOauthToken = async (req: Request, res: Response, type: OauthType) => {
    const credentials = TokenHandler.prototype.getClientCredentials(req);
    const client = await this.getClient(credentials.clientId, credentials.clientSecret);
    if (!client) {
      throw new UnauthorizedException('client_credentials_invalid');
    }
    const redisClient = this.redisManager.getClient();
    const data = await redisClient.get(`oauth:code:${req.body.code}`);
    if (!data) {
      throw new UnauthorizedException('code_credentials_invalid');
    }
    const { user, type: infoType } = JSON.parse(data);
    if (infoType !== type) {
      throw new UnauthorizedException();
    }
    const userInfo = await this.userService.findOne(user.id, null, ['badge']);
    if (!userInfo) {
      throw new UnauthorizedException('user_credentials_invalid');
    }
    return this.saveToken({
      accessToken: await this.generateAccessToken(),
      refreshToken: await this.generateRefreshToken(),
    }, client, userInfo);
  };

  private getClient = async (clientId: string, clientSecret: string) => {
    const client = await this.clientService.getOne(clientId, clientSecret);
    return client;
  };

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
  };

  private verifyScope = async () => true;

  private revokeToken = async (token: AccessTokenEntity) => {
    if (token) {
      if (token.refreshTokenExpiresAt >= new Date()) {
        return true;
      }
    }
    return false;
  };

  private getUser = async (email: string, password: string) => {
    const user = await this.userService.verifyUser(email, password);
    return user;
  };

  private generateAccessToken = async () => tokenUtil.generateRandomToken();

  private generateRefreshToken = async () => tokenUtil.generateRandomToken();
}
