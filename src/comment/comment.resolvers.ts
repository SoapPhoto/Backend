import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { UserEntity } from '@server/user/user.entity';
import { Maybe } from '@typings/index';
import { CommentService } from './comment.service';
import { CreatePictureCommentDot, GetPictureCommentListDto } from './dto/comment.dto';

@Resolver()
@UseGuards(AuthGuard)
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  @Query()
  public async pictureComments(
    @Context('user') user: Maybe<UserEntity>,
    @Args('id') id: string,
    @Args() query: GetPictureCommentListDto,
  ) {
    return this.commentService.getPictureList(id, query, user);
  }
  @Mutation()
  @Roles('user')
  public async addComment(
    @Context('user') user: UserEntity,
    @Args('id') id: string,
    @Args('data') data: CreatePictureCommentDot,
  ) {
    return this.commentService.create(data, id, user);
  }
}
