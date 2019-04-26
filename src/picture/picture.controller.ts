import { Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import * as fs from 'fs';

import { Roles } from '@/common/decorator/roles.decorator';
import { User } from '@/common/decorator/user.decorator';
import { File } from '@/common/interface/file.interface';
import { QiniuService } from '@/common/qiniu/qiniu.service';
import { photoUpload } from '@/common/utils/upload';
import { Maybe } from '@/typing';
import { UserEntity } from '@/user/user.entity';
import { GetPictureListDto } from './dto/picture.dto';
import { PictureService } from './picture.service';

@Controller('picture')
export class PictureController {
  constructor(
    private readonly qiniuService: QiniuService,
    private readonly pictureService: PictureService,
  ) {}

  @Post('upload')
  @Roles('user')
  @UseInterceptors(photoUpload)
  public async upload(
    @UploadedFile() file: File,
    @User() user: UserEntity,
  ) {
    try {
      const data = await this.qiniuService.uploadFile(file);
      const picture = await this.pictureService.create({
        user,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        ...data,
      });
      return picture;
    } finally {
      fs.unlink(file.path, () => null);
    }
  }

  @Delete(':id')
  @Roles('user')
  public async deletePicture (
    @Param('id') id: number,
    @User() user: UserEntity,
  ) {
    return this.pictureService.delete(id, user);
  }

  @Get()
  public async getList (
    @User() user: Maybe<UserEntity>,
    @Query() query: GetPictureListDto,
  ) {
    return this.pictureService.getList(user, query);
  }

  @Put('like/:id([0-9]+)')
  @Roles('user')
  public async updatePictureActivity(
    @Param('id') id: string,
    @User() user: UserEntity,
  ) {
    return this.pictureService.likePicture(id, user);
  }
}
