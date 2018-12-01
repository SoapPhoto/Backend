import * as auth from 'basic-auth';
import { Request, Response } from 'express';

// import { ApiError } from '@utils/error';
import passwordType from '../grantTypes/passwordType';
import refreshToken from '../grantTypes/refreshToken';
import { Imodel, IOauthConfig } from '../oauth';
import { OAuthError } from '../utils/error';

const grantTypes = {
  password: passwordType,
  refresh_token: refreshToken,
};

export default class Token {
  private model: Imodel;
  private accessTokenLifetime: number;
  private refreshTokenLifetime: number;
  constructor (options: IOauthConfig) {
    this.model = options.model;
    this.accessTokenLifetime = options.accessTokenLifetime || 3600;
    this.refreshTokenLifetime = options.refreshTokenLifetime || 1209600;
  }

  public handle = async (req: Request, res: Response) => {
    const client = await this.getClient(req, res);
    return this.handleGrantType(req, client);
  }

  private handleGrantType = (req: Request, client: any) => {
    const grantType = req.body.grant_type;
    if (client.grants.indexOf(grantType) < 0) {
      throw new OAuthError('unsupported_grant_type');
    }
    // tslint:disable-next-line:variable-name
    const Type = grantTypes[grantType];
    const options = {
      accessTokenLifetime: this.accessTokenLifetime,
      model: this.model,
      refreshTokenLifetime: this.refreshTokenLifetime,
    };
    return new Type(options).handle(req, client);
  }
  // 获取客户端
  private getClient = async (req: Request, res: Response) => {
    const credentials = this.getClientCredentials(req);
    // const grantType = req.body.grant_type
    if (!credentials.clientId || !credentials.clientSecret) {
      throw new OAuthError('error_credentials');
    }
    const client = await this.model.getClient(credentials.clientId, credentials.clientSecret);
    if (!client) {
      throw new OAuthError('invalid_client');
    }
    return client;
  }

  private getClientCredentials = (req: Request) => {
    const credentials = auth(req);
    if (credentials) {
      return { clientId: credentials.name, clientSecret: credentials.pass };
    }
    if (req.body && req.body.client_id && req.body.client_secret) {
      return { clientId: req.body.client_id, clientSecret: req.body.client_secret };
    }
    throw new OAuthError('error_credentials');
  }
}
