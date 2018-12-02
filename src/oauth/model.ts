import * as crypto from 'crypto';
import { getCustomRepository } from 'typeorm';

import { AccessTokenRepository } from '@repositories/AccessTokenRepository';
import { ClientRepository } from '@repositories/ClientRepository';
import { RefreshTokenRepository } from '@repositories/RefreshTokenRepository';
import { UserRepository } from '@repositories/UserRepository';
import { Imodel } from './oauth';

export default class OAuth2 implements Imodel {
  public clientRepository = getCustomRepository(ClientRepository);
  public userRepository = getCustomRepository(UserRepository);
  public accessTokenRepository = getCustomRepository(AccessTokenRepository);
  public refreshTokenRepository = getCustomRepository(RefreshTokenRepository);

  public getClient = async (clientId: string, clientSecret: string) => {
    const config = {
      clientId,
      clientSecret,
    };
    const client = await this.clientRepository.findOne(config);
    return client;
  }

  public getUser = async (username: string, password: string) => {
    const config = {
      username,
    };
    const user = await this.userRepository.findOne(config);
    if (user) {
      const hash = await crypto.pbkdf2Sync(password, user.salt, 20, 32, 'sha512').toString('hex');
      if (user.hash === hash) {
        delete user.salt;
        delete user.hash;
        return user;
      }
    }
    return;
  }

  public getAccessToken = async (accessToken: string): Promise<any> => {
    return await this.accessTokenRepository.getByToken(accessToken);
  }

  public saveToken =  async(
    token: any,
    client: any,
    user: any,
  ) => {
    const { accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt } = token;
    await Promise.all([
      this.accessTokenRepository.add({
        accessToken,
        accessTokenExpiresAt,
        client: client.id,
        user: user.id,
      }),
      this.refreshTokenRepository.add({
        refreshToken,
        refreshTokenExpiresAt,
        client: client.id,
        user: user.id,
      }),
    ]);
    return {
      accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt,
    };
  }

  // 校验RefreshToken的有效性
  public revokeToken =  async (token: any) => {
    if (token) {
      if (token.expires >= new Date()) {
        return true;
      }
    }
    return false;
  }

  public getRefreshToken = async (refreshToken: string) => {
    return await this.refreshTokenRepository.getByToken(refreshToken);
  }
}
