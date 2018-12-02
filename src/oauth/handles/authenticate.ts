import { Request, Response } from 'express';

import { AccessToken } from '@entities/AccessToken';
import { Imodel } from '../oauth';
import { OAuthError } from '../utils/error';
import { IOauthConfig } from './../oauth';

export default class Authenticate {
  private model: Imodel;
  constructor (options: IOauthConfig) {
    this.model = options.model;
  }

  public handle = async (req: Request, res: Response, roles: any) => {
    const token = this.getTokenFromRequest(req);
    const accessToken = await this.getAccessToken(token);
    this.validateAccessToken(accessToken, roles);
    (req as any).auth = accessToken;
  }

  public getTokenFromRequest = (req: Request) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new OAuthError('invalid_authorization');
    }
    return token.match(/Bearer\s(\S+)/)[1];
  }

  public getAccessToken = async (token: string) => {
    const accessToken = await this.model.getAccessToken(token);
    if (!accessToken) {
      throw new OAuthError('invalid_access_token');
    }
    return accessToken;
  }

  public validateAccessToken = (accessToken: AccessToken, roles: string[]) => {
    if (!(accessToken.expires instanceof Date)) {
      throw new OAuthError('invalid_access_token_expires_at');
    }

    if (accessToken.expires < new Date()) {
      throw new OAuthError('invalid_access_token_expired');
    }

    if (roles.length > 0) {
      if (!accessToken.user.roles) {
        throw new OAuthError('invalid_access_token_roles');
      }
      if (!accessToken.user.roles.findIndex(role => !!roles.findIndex(e => e === role))) {
        throw new OAuthError('invalid_access_token_roles');
      }
    }
    return accessToken;
  }
}
