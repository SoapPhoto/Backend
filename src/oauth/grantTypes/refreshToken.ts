import { Request } from 'express';

import { OAuthError } from '../utils/error';
import AbstractType from './abstractType';

export default class PasswordType extends AbstractType {
  constructor (options: any) {
    super(options);
  }
  public handle = async (req: Request, client: any) => {
    const token = await this.getRefreshToken(req);
    await this.revokeToken(token);
    return await this.saveToken(token.user, token.client);
  }
  public getRefreshToken = async (req: Request) => {
    const token = await this.model.getRefreshToken(req.body.refresh_token);
    if (!token) {
      throw new OAuthError('invalid_refresh_token');
    }
    return token;
  }
  public revokeToken = async (token: any) => {
    const isToken = await this.model.revokeToken(token);
    if (!isToken) {
      throw new OAuthError('invalid_refresh_token');
    }
    return isToken;
  }
}
