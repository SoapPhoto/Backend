import {
  Args, Context, Query, Resolver, ResolveProperty, Parent, Mutation,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { GetPictureListDto } from '@server/modules/picture/dto/picture.dto';
import { classToPlain } from 'class-transformer';
import { Role } from './enum/role.enum';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { CollectionService } from '../collection/collection.service';
import { UserPictureType } from './enum/picture.type.enum';
import { UpdateProfileSettingDto } from './dto/user.dto';
import { FollowService } from '../follow/follow.service';

@Resolver('User')
@UseGuards(AuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly collectionService: CollectionService,
    private readonly followService: FollowService,
  ) {}

  @Query()
  @Roles(Role.USER)
  public async whoami(
    @Context('user') user: UserEntity,
  ) {
    return classToPlain(await this.userService.getUser(user.id, user), {
      groups: [Role.OWNER],
    });
  }

  @Query()
  public async user(
    @Context('user') user: Maybe<UserEntity>,
    @Args('id') id: string,
    @Args('username') username: string,
  ) {
    return this.userService.getUser(id || username, user);
  }

  @Query()
  public async userPicturesByName(
    @Context('user') user: Maybe<UserEntity>,
    @Args('username') username: string,
    @Args('type') type: UserPictureType,
    @Args('query') query: GetPictureListDto,
  ) {
    if (type === UserPictureType.MY) {
      return this.userService.getUserPicture(username, query, user);
    }
    return this.userService.getUserLikePicture(username, query, user);
  }

  @Query()
  public async userPicturesById(
    @Context('user') user: Maybe<UserEntity>,
    @Args('id') id: string,
    @Args('type') type: UserPictureType,
    @Args('query') query: GetPictureListDto,
  ) {
    if (type === UserPictureType.MY) {
      return this.userService.getUserPicture(id, query, user);
    }
    return this.userService.getUserLikePicture(id, query, user);
  }

  @Query()
  public async userCollectionsByName(
    @Context('user') user: Maybe<UserEntity>,
    @Args('username') username: string,
    @Args('query') query: GetPictureListDto,
  ) {
    return this.collectionService.getUserCollectionList(username, query, user);
  }

  @Query()
  public async userCollectionsById(
    @Context('user') user: Maybe<UserEntity>,
    @Args('id') id: string,
    @Args('query') query: GetPictureListDto,
  ) {
    return this.collectionService.getUserCollectionList(id, query, user);
  }

  @Mutation()
  public async updateProfile(
    @Context('user') user: UserEntity,
    @Args('data') data: UpdateProfileSettingDto,
  ) {
    return this.userService.updateUserProfile(user, data);
  }

  @ResolveProperty('likesCount')
  public async likesCount(
    @Parent() parent: UserEntity,
  ) {
    return this.userService.userLikesCount(parent.id);
  }

  @ResolveProperty('isFollowing')
  public async isFollowing(
    @Context('user') user: Maybe<UserEntity>,
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
    return this.userService.getUserPreviewPictures(parent.username, limit);
  }
}
