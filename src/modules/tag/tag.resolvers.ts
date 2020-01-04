import {
  Args, Context, Query, Resolver, Info,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { UserEntity } from '@server/modules/user/user.entity';
import { GraphQLResolveInfo } from 'graphql';
import { GetTagPictureListDto } from './dto/tag.dto';
import { TagService } from './tag.service';
import { PictureService } from '../picture/picture.service';

@Resolver()
@UseGuards(AuthGuard)
export class TagResolver {
  constructor(
    private readonly tagService: TagService,
    private readonly pictureService: PictureService,
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
    @Info() info: GraphQLResolveInfo,
  ) {
    return this.pictureService.getTagPictureList(name, user, query, info);
  }
}
