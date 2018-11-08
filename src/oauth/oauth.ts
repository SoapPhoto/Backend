import { Request, Response } from 'express';

// tslint:disable-next-line:import-name
import AuthenticateHandles from './handles/authenticate';
import TokenHandles from './handles/token';

export type Falsey = '' | 0 | false | null | undefined;

export interface Imodel {
  getUser: (
    username: string,
    password: string,
  ) => Promise<any | Falsey>;
  getClient: (
    clientId: string,
    clientSecret: string,
  ) => Promise<any | Falsey>;
  saveToken: (
    token: any,
    client: any,
    user: any,
  ) => Promise<any | Falsey>;
  getRefreshToken: (
    refreshToken: string,
  ) => Promise<any | Falsey>;
  revokeToken: (token: any) => Promise<boolean>;
  getAccessToken: (accessToken: string) => Promise<any>;
}

export interface IOauthConfig {
  model: Imodel;
  accessTokenLifetime?: number;
  refreshTokenLifetime?: number;
}

export default class Oauth {
  private options: any;
  constructor (config: IOauthConfig) {
    this.options = config;
  }

  public token = async (req: Request, res: Response) => {
    const token = new TokenHandles(this.options);
    return await token.handle(req, res);
  }
  public authenticate = async (req: Request, res: Response, roles: string[]) => {
    const Token = new AuthenticateHandles(this.options);
    return await Token.handle(req, res, roles);
  }
}
