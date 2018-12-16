import { Request } from 'express';

import { OAuthError } from '../utils/error';
import AbstractType from './abstractType';

export default class PasswordType extends AbstractType {
  constructor (options: any) {
    super(options);
  }
  public handle = async (req: Request, client: any) => {
    const user = await this.getUser(req);
    return await this.saveToken(user, client);
  }
  public getUser = async (req: Request) => {
    const user = await this.model.getUser(req.body.username, req.body.password);
    if (!user) {
      throw new OAuthError('invalid_user');
    }
    return user;
  }
}
