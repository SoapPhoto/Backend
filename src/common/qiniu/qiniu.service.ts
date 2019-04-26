import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as qiniu from 'qiniu';

import { File } from '../interface/file.interface';

@Injectable()
export class QiniuService {
  public uploadFile(file: File): Promise<{hash: string; key: string}> {
    const mac = new qiniu.auth.digest.Mac(process.env.QN_ACCESS_KEY, process.env.QN_SECRET_KEY);
    const qiniuConfig = {
      scope: process.env.QN_BUCKET,
    };
    const uploadConfig = new qiniu.conf.Config() as any;
    uploadConfig.zone = qiniu.zone.Zone_z0;
    const formUploader = new qiniu.form_up.FormUploader(uploadConfig);
    const putPolicy = new qiniu.rs.PutPolicy(qiniuConfig);
    const putExtra = new qiniu.form_up.PutExtra();
    const uploadToken = putPolicy.uploadToken(mac);
    return new Promise((resolve, reject) => {
      formUploader.putFile(
        uploadToken,
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
        });
    });
  }
  public createBucketManager () {
    const mac = new qiniu.auth.digest.Mac(process.env.QN_ACCESS_KEY, process.env.QN_SECRET_KEY);
    const config = new qiniu.conf.Config() as any;
    config.zone = qiniu.zone.Zone_z0;
    return new qiniu.rs.BucketManager(mac, config);
  }
  public deleteFile(key: string) {
    const bucketManager = this.createBucketManager();
    return new Promise((resolve, reject) => {
      bucketManager.delete(process.env.QN_BUCKET, key, (respErr, respBody, respInfo) => {
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
}
