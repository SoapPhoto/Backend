import {
  Args, Context, Mutation, Query, Resolver, ResolveProperty, Parent,
} from '@nestjs/graphql';

import { UseGuards, Inject, forwardRef } from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { Role } from '@server/modules/user/enum/role.enum';
import { UserEntity } from '@server/modules/user/user.entity';
import { GetPictureListDto, GetUserPictureListDto, UpdatePictureDot } from './dto/picture.dto';
import { PictureService } from './picture.service';
import { CollectionService } from '../collection/collection.service';
import { PictureEntity } from './picture.entity';

@Resolver('Picture')
@UseGuards(AuthGuard)
export class PictureResolver {
  constructor(
    @Inject(forwardRef(() => CollectionService))
    private readonly collectionService: CollectionService,
    private readonly pictureService: PictureService,
  ) {}

  @Query()
  public async pictures(
    @Context('user') user: Maybe<UserEntity>,
    @Args() query: GetPictureListDto,
  ) {
    return this.pictureService.getList(user, query);
  }

  @Query()
  public async userPictures(
    @Context('user') user: Maybe<UserEntity>,
    @Args() query: GetUserPictureListDto,
  ) {
    return this.pictureService.getUserPicture(query.id || query.username, query, user);
  }

  @Query()
  public async picture(
    @Context('user') user: Maybe<UserEntity>,
    @Args('id') id: string,
  ) {
    return this.pictureService.getOnePicture(id, user, true, true);
  }

  @Query()
  public async pictureRelatedCollection(
    @Args('id') id: string,
  ) {
    return this.collectionService.pictureRelatedCollection(id);
  }

  @Mutation()
  @Roles(Role.USER)
  public async likePicture(
    @Context('user') user: UserEntity,
    @Args('id') id: string,
  ) {
    return this.pictureService.likePicture(id, user, true);
  }

  @Mutation()
  @Roles(Role.USER)
  public async unlikePicture(
    @Context('user') user: UserEntity,
    @Args('id') id: string,
  ) {
    return this.pictureService.likePicture(id, user, false);
  }

  @Mutation()
  @Roles(Role.USER)
  public async updatePicture(
    @Context('user') user: UserEntity,
    @Args('id') id: ID,
    @Args('data') data: UpdatePictureDot,
  ) {
    return this.pictureService.update(id, data, user);
  }

  @Mutation()
  @Roles(Role.USER)
  public async deletePicture(
    @Context('user') user: UserEntity,
    @Args('id') id: ID,
  ) {
    return this.pictureService.delete(id, user);
  }

  @ResolveProperty('relatedCollections')
  public async getAvatarSize(
    @Parent() parent: PictureEntity,
    @Args('limit') limit: number,
  ) {
    return this.collectionService.pictureRelatedCollection(parent.id, limit);
  }
}
