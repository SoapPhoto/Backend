import {
  Args, Context, Mutation, Query, Resolver, ResolveProperty, Parent,
} from '@nestjs/graphql';

import { UseGuards, Inject, forwardRef } from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { Role } from '@server/modules/user/enum/role.enum';
import { UserEntity } from '@server/modules/user/user.entity';
import { PicturesType } from '@common/enum/picture';
import {
  GetPictureListDto, GetUserPictureListDto, UpdatePictureDot, GetNewPictureListDto,
} from './dto/picture.dto';
import { PictureService } from './picture.service';
import { CollectionService } from '../collection/collection.service';
import { PictureEntity } from './picture.entity';
import { CommentService } from '../comment/comment.service';

@Resolver('Picture')
@UseGuards(AuthGuard)
export class PictureResolver {
  constructor(
    @Inject(forwardRef(() => CollectionService))
    private readonly collectionService: CollectionService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    private readonly pictureService: PictureService,
  ) {}

  @Query()
  public async pictures(
    @Context('user') user: Maybe<UserEntity>,
    @Args('query') query: GetPictureListDto,
      @Args('type') type: PicturesType = PicturesType.HOT,
  ) {
    if (type === PicturesType.NEW) {
      return this.pictureService.getList(user, query);
    }
    return this.pictureService.getPictureHotInfoList(user, query);
  }

  @Query()
  public async hotPictures(
    @Context('user') user: Maybe<UserEntity>,
    @Args('query') query: GetPictureListDto,
  ) {
    return this.pictureService.getPictureHotInfoList(user, query);
  }

  @Query()
  public async newPictures(
    @Context('user') user: Maybe<UserEntity>,
    @Args('query') query: GetNewPictureListDto,
  ) {
    return this.pictureService.getNewList(user, query);
  }

  @Query()
  public async userPictures(
    @Context('user') user: Maybe<UserEntity>,
    @Args('id') id: string,
    @Args('username') username: string,
    @Args('query') query: GetUserPictureListDto,
  ) {
    return this.pictureService.getUserPicture(id || username, query, user);
  }

  @Query()
  public async picture(
    @Context('user') user: Maybe<UserEntity>,
    @Context() context: any,
    @Args('id') id: string,
  ) {
    return this.pictureService.getOnePicture(id, user, true);
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

  @ResolveProperty('commentCount')
  public async commentCount(
    @Parent() parent: PictureEntity,
  ) {
    return this.commentService.getPictureCommentCount(parent.id);
  }

  @ResolveProperty('currentCollections')
  public async currentCollections(
    @Parent() parent: PictureEntity,
    @Context('user') user?: UserEntity,
  ) {
    if (!user) return [];
    return this.pictureService.getCurrentCollections(parent.id, user);
  }

  // @ResolveProperty('isLike')
  // public async isLike(
  //   @Context() content: any,
  // ) {
  //   if (!content) {
  //     return false;
  //   }
  //   return false;
  //   // return this.pictureService.getUserIsLike(parent.id, user);
  // }
}
