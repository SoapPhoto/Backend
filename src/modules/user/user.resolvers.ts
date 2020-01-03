import {
  Args, Context, Query, Resolver, ResolveProperty, Parent, Mutation, Info,
} from '@nestjs/graphql';
import { fieldsList } from 'graphql-fields-list';

import { UseGuards } from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { GetPictureListDto } from '@server/modules/picture/dto/picture.dto';
import { classToPlain } from 'class-transformer';
import { UserPictureType } from '@common/enum/picture';
import { User } from '@server/common/decorator/user.graphql.decorator';
import { GraphQLResolveInfo } from 'graphql';
import { Role } from './enum/role.enum';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { CollectionService } from '../collection/collection.service';
import { UpdateProfileSettingDto } from './dto/user.dto';
import { FollowService } from '../follow/follow.service';
import { PictureService } from '../picture/picture.service';

@Resolver('User')
@UseGuards(AuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly collectionService: CollectionService,
    private readonly followService: FollowService,
    private readonly pictureService: PictureService,
  ) {}

  @Query()
  @Roles(Role.USER)
  public async whoami(
    @User() user: UserEntity,
    @Info() info: GraphQLResolveInfo,
  ) {
    const fields = fieldsList(info);
    return classToPlain(await this.userService.findOne(user.id, user, fields), {
      groups: [Role.OWNER],
    });
  }

  @Query()
  public async user(
    @User() user: Maybe<UserEntity>,
    @Info() info: GraphQLResolveInfo,
    @Args('id') id: string,
    @Args('username') username: string,
  ) {
    const fields = fieldsList(info);
    return this.userService.findOne(id || username, user, fields);
  }

  @Query()
  public async userCollectionsByName(
    @User() user: Maybe<UserEntity>,
    @Args('username') username: string,
    @Args('query') query: GetPictureListDto,
  ) {
    return this.collectionService.getUserCollectionList(username, query, user);
  }

  @Query()
  public async userCollectionsById(
    @User() user: Maybe<UserEntity>,
    @Args('id') id: string,
    @Args('query') query: GetPictureListDto,
  ) {
    return this.collectionService.getUserCollectionList(id, query, user);
  }

  @Mutation()
  public async updateProfile(
    @User() user: UserEntity,
    @Args('data') data: UpdateProfileSettingDto,
  ) {
    return this.userService.updateUserProfile(user, data);
  }

  @ResolveProperty('likedCount')
  public async likedCount(
    @Parent() parent: UserEntity,
  ) {
    return this.pictureService.getUserLikedCount(parent.id);
  }

  @ResolveProperty('likesCount')
  public async likesCount(
    @Parent() parent: UserEntity,
  ) {
    return this.pictureService.userLikesCount(parent.id);
  }

  @ResolveProperty('isFollowing')
  public async isFollowing(
    @User() user: Maybe<UserEntity>,
    @Parent() parent: UserEntity,
  ) {
    if (!user) return 0;
    return this.followService.isFollowing(user, parent.id);
  }

  @ResolveProperty('followerCount')
  public async followerCount(
    @Parent() parent: UserEntity,
  ) {
    return this.followService.followerCount(parent.id);
  }

  @ResolveProperty('followedCount')
  public async followedCount(
    @Parent() parent: UserEntity,
  ) {
    return this.followService.followedCount(parent.id);
  }

  @ResolveProperty('pictures')
  public async getAvatarSize(
    @Parent() parent: UserEntity,
    @Args('limit') limit: number,
  ) {
    return this.pictureService.getUserPreviewPictures(parent.username, limit);
  }
}
