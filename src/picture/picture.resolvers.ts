import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { UserEntity } from '@server/user/user.entity';
import { Maybe } from '@typings/index';
import { GetPictureListDto, GetUserPictureListDto } from './dto/picture.dto';
import { PictureService } from './picture.service';

@Resolver()
@UseGuards(AuthGuard)
export class PictureResolver {
  constructor(
    private readonly pictureService: PictureService,
  ) {}

  @Query()
  public async getPictures(
    @Context('user') user: Maybe<UserEntity>,
    @Args() query: GetPictureListDto,
  ) {
    return this.pictureService.getList(user, query);
  }

  @Query()
  public async getUserPictures(
    @Context('user') user: Maybe<UserEntity>,
    @Args() query: GetUserPictureListDto,
  ) {
    return this.pictureService.getUserPicture(query.id || query.username, query, user);
  }

  @Query()
  public async getPicture(
    @Context('user') user: Maybe<UserEntity>,
    @Args('id') id: string,
  ) {
    return this.pictureService.getOnePicture(id, user, true);
  }

  @Mutation()
  @Roles('user')
  public async likePicture(
    @Context('user') user: UserEntity,
    @Args('id') id: string,
  ) {
    return this.pictureService.likePicture(id, user);
  }
}
