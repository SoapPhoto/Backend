import {
  Body, Controller, Get, Param, Post, Query, UseFilters, UseGuards, Put,
} from '@nestjs/common';

import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { Role } from '@server/modules/user/enum/role.enum';
import { UserEntity } from '@server/modules/user/user.entity';
import { CollectionService } from './collection.service';
import { CreateCollectionDot, GetCollectionPictureListDto } from './dto/collection.dto';

@Controller('api/collection')
@UseGuards(AuthGuard)
@UseFilters(new AllExceptionFilter())
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
  ) {}

  @Post('')
  @Roles(Role.USER)
  public async createCollection(
    @Body() body: CreateCollectionDot,
    @User() user: UserEntity,
  ) {
    return this.collectionService.create(body, user);
  }

  @Put('/:collectionId/add/:pictureId')
  @Roles(Role.USER)
  public async addPictureCollection(
    @Param('pictureId') pictureId: string,
    @Param('collectionId') collectionId: string,
    @User() user: UserEntity,
  ) {
    return this.collectionService.addPicture(collectionId, pictureId, user);
  }

  @Put('/:collectionId/remove/:pictureId')
  @Roles(Role.USER)
  public async removePictureCollection(
    @Param('pictureId') pictureId: string,
    @Param('collectionId') collectionId: string,
    @User() user: UserEntity,
  ) {
    return this.collectionService.removePicture(collectionId, pictureId, user);
  }

  @Get('/:collectionId')
  public async collectionDetail(
    @Param('collectionId') collectionId: string,
    @Query() query: GetCollectionPictureListDto,
    @User() user: Maybe<UserEntity>,
  ) {
    return this.collectionService.getCollectionDetail(collectionId, user);
  }

  @Get('/:collectionId/picture')
  public async collectionPictureList(
    @Param('collectionId') collectionId: string,
    @Query() query: GetCollectionPictureListDto,
    @User() user: Maybe<UserEntity>,
  ) {
    return this.collectionService.getCollectionPictureList(collectionId, query, user);
  }
}
