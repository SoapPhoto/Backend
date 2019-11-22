require('dotenv').config({
  path: '.env.production',
});

const path = require('path');
const fs = require('fs');
const qiniu = require('qiniu');
const FileHound = require('filehound');

const PUBLIC_PATH = path.join(__dirname, '../.next');
const PREFIX = '_next';

const mac = new qiniu.auth.digest.Mac(process.env.QN_ACCESS_KEY, process.env.QN_SECRET_KEY);

const options = {
  scope: process.env.QN_BUCKET,
};

const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;
config.useHttpsDomain = true;
config.useCdnDomain = true;

const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

async function upFile() {
  const src = `${PUBLIC_PATH}/static`;
  const files = await FileHound.create()
    .paths(src)
    .find();
  await Promise.all(files.map(async (v) => {
    const key = v.replace(PUBLIC_PATH, PREFIX).replace(/\\/g, '/');
    return new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, key, v, putExtra, (respErr,
        respBody, respInfo) => {
        if (respErr) {
          reject(respErr);
        }
        if (respInfo.statusCode == 200) {
          console.log(`${key} 上传成功!`);
          resolve('ok');
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
          resolve(respInfo.statusCode);
        }
      });
    });
  }));
}
upFile();
