import {
  Args, Context, Query, Resolver,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { GetPictureListDto } from '@server/modules/picture/dto/picture.dto';
import { Role } from './role.enum';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { CollectionService } from '../collection/collection.service';

@Resolver()
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
    return user;
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
    @Args() query: GetPictureListDto,
  ) {
    return this.userService.getUserPicture(username, query, user);
  }

  @Query()
  public async userPicturesById(
    @Context('user') user: Maybe<UserEntity>,
    @Args('id') username: string,
    @Args() query: GetPictureListDto,
  ) {
    return this.userService.getUserPicture(username, query, user);
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
}
