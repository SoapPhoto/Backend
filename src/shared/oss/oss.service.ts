import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';

import { uploadPolicy } from './policy';

let expirationTime: Date | null = null;
const oss: any = null;

@Injectable()
export class OssService {
  public async test() {
    if (
      oss === null
      || expirationTime === null
      || expirationTime.getTime() <= new Date().getTime()
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

      expirationTime = new Date(auth.Expiration);
      return {
        AccessKeyId: auth.AccessKeyId,
        AccessKeySecret: auth.AccessKeySecret,
        SecurityToken: auth.SecurityToken,
        Expiration: auth.Expiration,
      };
      // const data = {
      //   AccessKeyId: auth.AccessKeyId,
      //   AccessKeySecret: auth.AccessKeySecret,
      //   SecurityToken: auth.SecurityToken,
      //   Expiration: auth.Expiration
      // }

      // oss = new OSS.OSS({
      //   region: 'oss-cn-shanghai',
      //   accessKeyId: auth.AccessKeyId,
      //   accessKeySecret: auth.AccessKeySecret,
      //   stsToken: auth.SecurityToken,
      //   bucket: 'eesast',
      //   cname: true,
      //   endpoint: process.env.STATIC_URL,
      //   secure: true,
      // });
      // return oss;
    }
    // return oss;
  }
}
