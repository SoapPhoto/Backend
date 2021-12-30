import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';

import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { Role } from '@server/modules/user/enum/role.enum';
import { UserEntity } from '@server/modules/user/user.entity';
import { CollectionService } from './collection.service';
import {
  CreateCollectionDot,
  GetCollectionPictureListDto,
  UpdateCollectionDot,
} from './dto/collection.dto';

@Controller('api/collection')
@UseGuards(AuthGuard)
@UseFilters(new AllExceptionFilter())
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post('')
  @Roles(Role.USER)
  public async createCollection(
    @Body() body: CreateCollectionDot,
    @User() user: UserEntity
  ) {
    return this.collectionService.create(body, user);
  }

  @Delete('/:collectionId')
  @Roles(Role.USER)
  public async deleteCollection(
    @Param('collectionId') collectionId: number,
    @User() user: UserEntity
  ) {
    return this.collectionService.deleteCollection(collectionId, user);
  }

  @Put('/:collectionId')
  @Roles(Role.USER)
  public async updateCollection(
    @Body() body: UpdateCollectionDot,
    @Param('collectionId') collectionId: number,
    @User() user: UserEntity
  ) {
    return this.collectionService.updateCollection(body, collectionId, user);
  }

  @Post('/:collectionId/:pictureId')
  @Roles(Role.USER)
  public async addPictureCollection(
    @Param('pictureId') pictureId: number,
    @Param('collectionId') collectionId: number,
    @User() user: UserEntity
  ) {
    return this.collectionService.addPicture(collectionId, pictureId, user);
  }

  @Delete('/:collectionId/:pictureId')
  @Roles(Role.USER)
  public async removePictureCollection(
    @Param('pictureId') pictureId: number,
    @Param('collectionId') collectionId: number,
    @User() user: UserEntity
  ) {
    return this.collectionService.removePicture(collectionId, pictureId, user);
  }

  @Get('/:collectionId')
  public async collectionDetail(
    @Param('collectionId') collectionId: number,
    @Query() query: GetCollectionPictureListDto,
    @User() user: Maybe<UserEntity>
  ) {
    return this.collectionService.getCollectionDetail(collectionId, user);
  }

  @Get('/:collectionId/pictures')
  public async collectionPictureList(
    @Param('collectionId') collectionId: number,
    @Query() query: GetCollectionPictureListDto,
    @User() user: Maybe<UserEntity>
  ) {
    // return this.collectionService.getCollectionPictureList(collectionId, query, user);
  }
}
