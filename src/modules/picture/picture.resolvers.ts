import {
  Args, Mutation, Query, Resolver, ResolveProperty, Parent, Info,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import {
  UseGuards, Inject, forwardRef,
} from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { Role } from '@server/modules/user/enum/role.enum';
import { UserEntity } from '@server/modules/user/user.entity';
import { PicturesType } from '@common/enum/picture';
import { BadgeType } from '@common/enum/badge';
import { User } from '@server/common/decorator/user.graphql.decorator';
import {
  GetPictureListDto, GetUserPictureListDto, UpdatePictureDot, GetNewPictureListDto,
} from './dto/picture.dto';
import { PictureService } from './picture.service';
import { CollectionService } from '../collection/collection.service';
import { PictureEntity } from './picture.entity';
import { CommentService } from '../comment/comment.service';
import { BadgeService } from '../badge/badge.service';

@Resolver('Picture')
@UseGuards(AuthGuard)
export class PictureResolver {
  constructor(
    @Inject(forwardRef(() => CollectionService))
    private readonly collectionService: CollectionService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    private readonly pictureService: PictureService,
    @Inject(forwardRef(() => BadgeService))
    private readonly badgeService: BadgeService,
  ) {}

  @Query()
  public async searchPictures(
    @User() user: Maybe<UserEntity>,
    @Args('query') query: GetPictureListDto,
    @Args('words') words: string,
  ) {
    return this.pictureService.search(words, query, user);
  }


  @Query()
  public async pictures(
    @User() user: Maybe<UserEntity>,
    @Args('query') query: GetPictureListDto,
    @Info() info: GraphQLResolveInfo,
      @Args('type') type: PicturesType = PicturesType.HOT,
  ) {
    if (type === PicturesType.HOT) {
      return this.pictureService.getPictureHotInfoList(user, query, info);
    }
    return this.pictureService.find(user, type, query, info);
  }

  @Query()
  public async newPictures(
    @User() user: Maybe<UserEntity>,
    @Args('query') query: GetNewPictureListDto,
  ) {
    return this.pictureService.getNewList(user, query);
  }

  @Query()
  public async userPictures(
    @User() user: Maybe<UserEntity>,
    @Args('id') id: string,
    @Args('username') username: string,
    @Args('query') query: GetUserPictureListDto,
    @Info() info: GraphQLResolveInfo,
  ) {
    return this.pictureService.getUserPicture(id || username, query, user, info);
  }

  @Query()
  public async picture(
    @User() user: Maybe<UserEntity>,
    @Info() info: GraphQLResolveInfo,
    @Args('id') id: number,
  ) {
    this.pictureService.addViewCount(id);
    return this.pictureService.findOne(id, user, true, info);
  }

  @Query()
  public async pictureRelatedCollection(
    @Args('id') id: number,
  ) {
    return this.collectionService.pictureRelatedCollection(id);
  }

  @Mutation()
  @Roles(Role.USER)
  public async likePicture(
    @User() user: UserEntity,
    @Args('id') id: number,
  ) {
    return this.pictureService.likePicture(id, user, true);
  }

  @Mutation()
  @Roles(Role.USER)
  public async unlikePicture(
    @User() user: UserEntity,
    @Args('id') id: number,
  ) {
    return this.pictureService.likePicture(id, user, false);
  }

  @Mutation()
  @Roles(Role.USER)
  public async updatePicture(
    @User() user: UserEntity,
    @Args('id') id: number,
    @Args('data') data: UpdatePictureDot,
  ) {
    return this.pictureService.update(id, data, user);
  }

  @Mutation()
  @Roles(Role.USER)
  public async deletePicture(
    @User() user: UserEntity,
    @Args('id') id: number,
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
    @User() user?: UserEntity,
  ) {
    if (!user) return [];
    return this.pictureService.getCurrentCollections(parent.id, user);
  }
}
