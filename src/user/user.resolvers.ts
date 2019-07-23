import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { GetPictureListDto } from '@server/picture/dto/picture.dto';
import { Maybe } from '@typings/types';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Resolver()
@UseGuards(AuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Query()
  @Roles('user')
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
}
