import { Request, Response } from 'express';

import { Imodel } from '../oauth';
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
      throw new Error('invalid_authorization');
    }
    return token.match(/Bearer\s(\S+)/)[1];
  }

  public getAccessToken = async (token: string) => {
    const accessToken = await this.model.getAccessToken(token);
    if (!accessToken) {
      throw new Error('invalid_access_token');
    }
    return accessToken;
  }

  public validateAccessToken = (accessToken: any, roles: any) => {
    if (!(accessToken.accessTokenExpiresAt instanceof Date)) {
      throw new Error('invalid_access_token_expires_at');
    }

    if (accessToken.accessTokenExpiresAt < new Date()) {
      throw new Error('invalid_access_token_expired');
    }

    return accessToken;
  }
}
