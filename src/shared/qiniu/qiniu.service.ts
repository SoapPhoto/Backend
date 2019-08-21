import { Injectable } from '@nestjs/common';
import path from 'path';
import qiniu from 'qiniu';

import { File } from '../../common/interface/file.interface';

@Injectable()
export class QiniuService {
  private config: qiniu.rs.PutPolicyOptions = {
    scope: process.env.QN_BUCKET,
    callbackUrl: 'https://eniluiqxyujmi.x.pipedream.net/',
    // callbackUrl: `${process.env.QN_BUCKET}/api/upload/callback`,
    callbackBodyType: 'application/json',
  }

  private baseCallbackBody = {
    key: '$(key)',
    hash: '$(etag)',
    size: '$(fsize)',
    mimetype: '$(mimeType)',
    originalname: '$(fname)',
  }

  public uploadFile(file: File): Promise<{hash: string; key: string}> {
    const uploadConfig = new qiniu.conf.Config() as any;
    uploadConfig.zone = qiniu.zone.Zone_z0;
    const formUploader = new qiniu.form_up.FormUploader(uploadConfig);
    const putExtra = new qiniu.form_up.PutExtra();
    return new Promise((resolve, reject) => {
      formUploader.putFile(
        this.createToken(),
        file.filename,
        path.join(process.cwd(), file.path),
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr);
          }
          if (respInfo.statusCode === 200) {
            resolve(respBody);
          } else {
            reject(respInfo);
          }
        },
      );
    });
  }

  public createToken(callbackData: Record<string, string> = {}) {
    const mac = new qiniu.auth.digest.Mac(process.env.QN_ACCESS_KEY, process.env.QN_SECRET_KEY);
    const putPolicy = new qiniu.rs.PutPolicy({
      ...this.config,
      callbackBody: JSON.stringify({
        ...callbackData,
        ...this.baseCallbackBody,
      }),
    });
    return putPolicy.uploadToken(mac);
  }

  public createBucketManager() {
    const mac = new qiniu.auth.digest.Mac(process.env.QN_ACCESS_KEY, process.env.QN_SECRET_KEY);
    const config = new qiniu.conf.Config() as any;
    config.zone = qiniu.zone.Zone_z0;
    return new qiniu.rs.BucketManager(mac, config);
  }

  public deleteFile(key: string) {
    const bucketManager = this.createBucketManager();
    return new Promise((resolve, reject) => {
      bucketManager.delete(process.env.QN_BUCKET!, key, (respErr, respBody, respInfo) => {
        if (respErr) {
          reject(respErr);
        }
        if (respInfo.statusCode === 200 || respInfo.statusCode === 612) {
          resolve(respBody);
        } else {
          reject(respInfo);
        }
      });
    });
  }

  public isQiniuCallback(url: string, authorization: string) {
    const mac = new qiniu.auth.digest.Mac(process.env.QN_ACCESS_KEY, process.env.QN_SECRET_KEY);
    return qiniu.util.isQiniuCallback(mac, url, null, authorization);
  }
}
