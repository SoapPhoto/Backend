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
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import fs from 'fs';

import { CommentService } from '@server/comment/comment.service';
import { CreatePictureCommentDot, GetPictureCommentListDto } from '@server/comment/dto/comment.dto';
import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { File } from '@server/common/interface/file.interface';
import { photoUpload } from '@server/common/utils/upload';
import { QiniuService } from '@server/shared/qiniu/qiniu.service';
import { UserEntity } from '@server/user/user.entity';
import { CreatePictureAddDot, GetPictureListDto } from './dto/picture.dto';
import { PictureService } from './picture.service';

@Controller('api/picture')
@UseGuards(AuthGuard)
@UseFilters(new AllExceptionFilter())
export class PictureController {
  constructor(
    private readonly qiniuService: QiniuService,
    private readonly commentService: CommentService,
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
      const { info, tags = [], ...restInfo } = body;
      const data = await this.qiniuService.uploadFile(file);
      const picture = await this.pictureService.create({
        tags,
        user,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        ...info,
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

  @Get(':id([0-9]+)/comments')
  public async getPictureCommentList(
    @Param('id') id: string,
    @User() user: Maybe<UserEntity>,
    @Query() query: GetPictureCommentListDto,
  ) {
    return this.commentService.getPictureList(id, query, user);
  }

  @Post(':id([0-9]+)/comment')
  @Roles('user')
  public async createPictureComment(
    @Body() data: CreatePictureCommentDot,
    @Param('id') id: string,
    @User() user: UserEntity,
  ) {
    return this.commentService.create(data, id, user);
  }
}
