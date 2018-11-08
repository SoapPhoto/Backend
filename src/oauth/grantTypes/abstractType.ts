import * as crypto from 'crypto';
import { Request } from 'express';

import { Imodel } from '../oauth';

export default class AbstractType {
  public model: Imodel;
  public refreshTokenLifetime: number;
  public accessTokenLifetime: number;
  constructor (options: any) {
    this.model = options.model;
    this.refreshTokenLifetime = options.refreshTokenLifetime;
    this.accessTokenLifetime = options.accessTokenLifetime;
  }
  public getScope = (req: Request) => {
    console.log(req.body.scope);

    return req.body.scope;
  }
  public generateAccessToken = (): Promise<string> => {
    return generateRandomToken();
  }
  public generateRefreshToken = (): Promise<string> => {
    return generateRandomToken();
  }
  public getAccessTokenExpiresAt = () => {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.accessTokenLifetime);

    return expires;
  }
  public getRefreshTokenExpiresAt = () => {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.refreshTokenLifetime);

    return expires;
  }
  public saveToken = async (user: any, client: any) => {
    const fns = [
      this.generateAccessToken(),
      this.generateRefreshToken(),
    ];
    const accessTokenExpiresAt = this.getAccessTokenExpiresAt();
    const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt();
    return Promise.all(fns)
      .then(([accessToken, refreshToken]) => {
        const token = {
          accessToken,
          refreshToken,
          accessTokenExpiresAt,
          refreshTokenExpiresAt,
        };
        return this.model.saveToken(token, client, user);
      });
  }
}

function generateRandomToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(256, (err, buf) => {
      if (err) {
        reject(err);
      }
      const token = crypto
        .createHash('sha1')
        .update(buf)
        .digest('hex');
      resolve(token);
    });
  });
}
