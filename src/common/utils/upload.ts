import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import mime from 'mime-types';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const photoUpload = (type = 'photo') => FileInterceptor(type, {
  storage: diskStorage({
    destination: './photo',
    filename: (req, file, cb) => {
      const ext = extname(file.originalname);
      const mimetype = mime.lookup(ext);
      if (!(mimetype && /^image/g.test(mimetype))) {
        return cb(new BadRequestException('error file'), '');
      }
      const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
      return cb(null, `${randomName}${ext}`);
    },
  }),
});
