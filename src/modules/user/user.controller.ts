import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import fs from 'fs';

import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { File } from '@server/common/interface/file.interface';
import { photoUpload } from '@server/common/utils/upload';
import { GetPictureListDto } from '@server/modules/picture/dto/picture.dto';
import { QiniuService } from '@server/shared/qiniu/qiniu.service';
import { classToPlain } from 'class-transformer';
import { CollectionService } from '@server/modules/collection/collection.service';
import { GetUserCollectionListDto } from '@server/modules/collection/dto/collection.dto';
import { UpdateProfileSettingDto } from './dto/user.dto';
import { Role } from './enum/role.enum';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('api/user')
@UseGuards(AuthGuard)
@UseFilters(new AllExceptionFilter())
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly qiniuService: QiniuService,
    private readonly collectionService: CollectionService,
  ) {}

  @Get('whoami')
  @Roles(Role.USER)
  public async getMyInfo(
    @User() user: UserEntity,
  ) {
    return this.userService.getUser(user.id, user);
  }

  @Get(':idOrName/picture')
  public async getUserPicture(
    @Param('idOrName') idOrName: string,
    @User() user: Maybe<UserEntity>,
    @Query() query: GetPictureListDto,
  ) {
    return this.userService.getUserPicture(idOrName, query, user);
  }

  @Get(':idOrName/picture/like')
  public async getUserLikePicture(
    @Param('idOrName') idOrName: string,
    @User() user: Maybe<UserEntity>,
    @Query() query: GetPictureListDto,
  ) {
    return this.userService.getUserLikePicture(idOrName, query, user);
  }

  @Post(':name/setting/profile')
  @Roles(Role.USER)
  public async updateUserSetting(
    @Param('name') username: string,
    @User() user: UserEntity,
    @Body() body: UpdateProfileSettingDto,
  ) {
    if (user.username !== username) {
      throw new ForbiddenException();
    }
    return this.userService.updateUserProfile(user, body);
  }

  @Get(':id([0-9]+)')
  public async getIdInfo(
    @Param('id') id: string,
    @User() user: Maybe<UserEntity>,
  ) {
    return this.userService.getUser(id, user);
  }

  @Get(':name')
  public async getNameInfo(
    @Param('name') username: string,
    @User() user: Maybe<UserEntity>,
  ) {
    return this.userService.getUser(username, user);
  }

  @Get(':idOrName/collection')
  public async getUserCollections(
    @Param('idOrName') idOrName: string,
    @User() user: Maybe<UserEntity>,
    @Query() query: GetUserCollectionListDto,
  ) {
    return this.collectionService.getUserCollectionList(idOrName, query, user);
  }
}
