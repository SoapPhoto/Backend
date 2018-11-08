import * as crypto from 'crypto';
import { getCustomRepository } from 'typeorm';

import { ClientRepository } from '@repositories/ClientRepository';
import { Imodel } from './oauth';

export default class OAuth2 implements Imodel {
  public clientRepository: ClientRepository = getCustomRepository(ClientRepository);

  public getClient = async (clientId: string, clientSecret: string) => {
    const config = {
      clientId,
      clientSecret,
    };
    return await this.clientRepository.findOne(config);
  }

  public getUser = async (username: string, password: string) => {
    const config = {
      username,
    };
    return '';
  }

  public getAccessToken = async (accessToken: string): Promise<any> => {
    return '';
  }

  public saveToken =  async(
    token: any,
    client: any,
    user: any,
  ) => {
    return '';
  }

  // 校验RefreshToken的有效性
  public revokeToken =  async (token: any) => {
    return false;
  }

  public getRefreshToken = async (refreshToken: string) => {
    return '';
  }
}
