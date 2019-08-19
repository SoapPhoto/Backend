import {
  Args, Context, Query, Resolver,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { UserEntity } from '@server/modules/user/user.entity';
import { GetTagPictureListDto } from './dto/tag.dto';
import { TagService } from './tag.service';

@Resolver()
@UseGuards(AuthGuard)
export class TagResolver {
  constructor(
    private readonly tagService: TagService,
  ) {}

  @Query()
  public async tag(
    @Context('user') user: Maybe<UserEntity>,
    @Args('name') name: string,
  ) {
    return this.tagService.getTagInfo(name, user);
  }

  @Query()
  public async tagPictures(
    @Context('user') user: Maybe<UserEntity>,
    @Args('name') name: string,
    @Args() query: GetTagPictureListDto,
  ) {
    return this.tagService.getTagPicture(name, user, query);
  }
}
