import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import fs from 'fs';

import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { File } from '@server/common/interface/file.interface';
import { QiniuService } from '@server/common/modules/qiniu/qiniu.service';
import { photoUpload } from '@server/common/utils/upload';
import { UserEntity } from '@server/user/user.entity';
import { Maybe } from '@typings/index';
import { CreatePictureAddDot, GetPictureListDto } from './dto/picture.dto';
import { PictureService } from './picture.service';

@Controller('api/picture')
@UseGuards(AuthGuard)
export class PictureController {
  constructor(
    private readonly qiniuService: QiniuService,
    private readonly pictureService: PictureService,
  ) {}

  @Post('upload')
  @Roles('user')
  @UseInterceptors(photoUpload('photo'))
  public async upload(
    @UploadedFile() file: File,
    @Body() body: CreatePictureAddDot,
    @User() user: UserEntity,
  ) {
    if (!file) {
      throw new BadRequestException('error file');
    }
    try {
      const { info, tags, ...restInfo } = body;
      const infoObj = JSON.parse(info);
      const tagObj = JSON.parse(tags);
      const data = await this.qiniuService.uploadFile(file);
      const picture = await this.pictureService.create({
        user,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        tags: tagObj,
        ...infoObj,
        ...restInfo,
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

  @Get(':id([0-9]+)')
  public async getOne(
    @Param('id') id: string,
    @User() user: UserEntity,
  ) {
    return this.pictureService.getOnePicture(id, user, true);
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
