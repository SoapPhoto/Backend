import { Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { Roles } from '@/common/decorator/roles.decorator';
import { User } from '@/common/decorator/user.decorator';
import { File } from '@/common/interface/file.interface';
import { QiniuService } from '@/common/qiniu/qiniu.service';
import { UserEntity } from '@/user/user.entity';
import { plainToClass } from 'class-transformer';
import { PictureService } from './picture.service';

@Controller('picture')
export class PictureController {
  constructor(
    private readonly qiniuService: QiniuService,
    private readonly pictureService: PictureService,
  ) {}

  @Post('upload')
  @Roles('user')
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './photo',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  public async upload(
    @UploadedFile() file: File,
    @User() user: UserEntity,
  ) {
    const data = await this.qiniuService.uploadFile(file);
    const picture = await this.pictureService.create({
      user,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      ...data,
    });
    return picture;
  }

  @Get()
  public async getList () {
    return this.pictureService.getList();
  }
}
