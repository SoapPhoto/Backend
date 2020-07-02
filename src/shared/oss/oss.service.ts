import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';

import { uploadPolicy } from './policy';
import { ISts } from './oss.interface';

@Injectable()
export class OssService {
  private sts: Maybe<ISts> = null

  private expirationTime: Maybe<Date> = null

  public async getSts(): Promise<ISts> {
    if (
      this.sts === null
      || this.expirationTime === null
      || this.expirationTime.getTime() <= new Date().getTime()
    ) {
      const client = new OSS.STS({
        accessKeyId: process.env.OSS_KEY_ID!,
        accessKeySecret: process.env.OSS_KEY_SECRET!,
      });

      const auth = await new Promise<any>((resolve, reject) => client
        .assumeRole(process.env.OSS_ROLE_ARN, uploadPolicy, 3600)
        .then((result: any) => {
          resolve(result.credentials);
        })
        .catch((err: Error) => {
          console.error(err);
          reject(err);
        }));

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
}
