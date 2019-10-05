import {
  Args, Context, Query, Resolver,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { GetPictureListDto } from '@server/modules/picture/dto/picture.dto';
import { Role } from './enum/role.enum';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { CollectionService } from '../collection/collection.service';
import { UserPictureType } from './enum/picture.type.enum';

@Resolver('User')
@UseGuards(AuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly collectionService: CollectionService,
  ) {}

  @Query()
  @Roles(Role.USER)
  public whoami(
    @Context('user') user: UserEntity,
  ) {
    return this.userService.getUser(user.id, user);
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
    @Args() query: GetPictureListDto,
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
    @Args() query: GetPictureListDto,
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
    @Args() query: GetPictureListDto,
  ) {
    return this.collectionService.getUserCollectionList(username, query, user);
  }

  @Query()
  public async userCollectionsById(
    @Context('user') user: Maybe<UserEntity>,
    @Args('id') id: string,
    @Args() query: GetPictureListDto,
  ) {
    return this.collectionService.getUserCollectionList(id, query, user);
  }
  // @ResolveProperty('avatar')
  // public async getAvatarSize(
  //   @Parent() parent: any,
  //   @Args() data: string,
  // ) {
  //   console.log(12312, parent, data);
  // }
}
