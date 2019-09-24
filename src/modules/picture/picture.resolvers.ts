import {
  Args, Context, Mutation, Query, Resolver,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { Role } from '@server/modules/user/enum/role.enum';
import { UserEntity } from '@server/modules/user/user.entity';
import { GetPictureListDto, GetUserPictureListDto } from './dto/picture.dto';
import { PictureService } from './picture.service';

@Resolver()
@UseGuards(AuthGuard)
export class PictureResolver {
  constructor(
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

  @Mutation()
  @Roles(Role.USER)
  public async likePicture(
    @Context('user') user: UserEntity,
    @Args('id') id: string,
  ) {
    return this.pictureService.likePicture(id, user, true);
  }
}
