import * as fs from 'fs';
import * as shortid from 'shortid';

export const storeUpload = async (stream: any, filename: string, folder: string): Promise<any> => {
  const id = shortid.generate();
  const pathname = `${folder}/${id}-${filename}`;
  await fs.mkdir(folder, () => console.log(`folder ${folder} was created`));
  return new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(pathname))
      .on('finish', () => resolve({ id, pathname }))
      .on('error', reject),
  );
};
