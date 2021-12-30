import { Injectable, BadGatewayException } from '@nestjs/common';
import * as OSS from 'ali-oss';
import axios from 'axios';
import crypto from 'crypto';

import { Request } from 'express';
import { uploadPolicy } from './policy';
import { ISts } from './oss.interface';

@Injectable()
export class OssService {
  private sts: Maybe<ISts> = null;

  private expirationTime: Maybe<Date> = null;

  public async getSts(): Promise<ISts> {
    if (
      this.sts === null ||
      this.expirationTime === null ||
      this.expirationTime.getTime() <= new Date().getTime()
    ) {
      const client = new OSS.STS({
        accessKeyId: process.env.OSS_KEY_ID!,
        accessKeySecret: process.env.OSS_KEY_SECRET!,
      });

      const auth = await new Promise<any>((resolve, reject) =>
        client
          .assumeRole(process.env.OSS_ROLE_ARN, uploadPolicy, 3600)
          .then((result: any) => {
            resolve(result.credentials);
          })
          .catch((err: Error) => {
            console.error(err);
            reject(err);
          })
      );

      this.expirationTime = new Date(auth.Expiration);
      this.sts = {
        AccessKeyId: auth.AccessKeyId,
        AccessKeySecret: auth.AccessKeySecret,
        SecurityToken: auth.SecurityToken,
        Expiration: auth.Expiration,
      };
      return this.sts;
    }
    return this.sts;
  }

  public async isOssCallback(data: any, req: Request) {
    const { headers } = req;
    const publicKeyUrl = Buffer.from(
      headers['x-oss-pub-key-url'] as string,
      'base64'
    ).toString();
    const publicKey = (await axios(publicKeyUrl).then(
      (res) => res.data
    )) as string;
    const authString = `${req.originalUrl}\n${JSON.stringify(req.body)}`;
    const result = crypto
      .createVerify('RSA-MD5')
      .update(authString)
      .verify(publicKey, headers.authorization!, 'base64');
    if (!result) {
      throw new BadGatewayException('verification gives a false result');
    }
  }
}
