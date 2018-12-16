
import * as qiniu from 'qiniu';

import config from 'src/config';

export function qiniuUpload(pathname: string, filename: string): Promise<any> {
  const mac = new qiniu.auth.digest.Mac(config.qn.accessKey, config.qn.secretKey);
  const qiniuConfig = {
    scope: config.qn.bucket,
  };
  const uploadConfig = new qiniu.conf.Config() as any;
  uploadConfig.zone = qiniu.zone.Zone_z0;
  const formUploader = new qiniu.form_up.FormUploader(uploadConfig);
  const putPolicy = new qiniu.rs.PutPolicy(qiniuConfig);
  const putExtra = new qiniu.form_up.PutExtra();
  const uploadToken = putPolicy.uploadToken(mac);
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, filename, pathname, putExtra, (respErr, respBody, respInfo) => {
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

// export function getUrl(key: string, query?: string) {
//   return `${config.qiniuUrl}/${key}${query}`;
// }
