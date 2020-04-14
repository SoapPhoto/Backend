import {
  Args, Context, Mutation, Query, Resolver, ResolveField, Parent,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { Role } from '@server/modules/user/enum/role.enum';
import { UserEntity } from '@server/modules/user/user.entity';
import { ClientInfo, IClientInfo } from '@server/common/decorator/client_info.decorator';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { CreatePictureCommentDot, GetPictureCommentListDto } from './dto/comment.dto';

@Resolver('Comment')
@UseGuards(AuthGuard)
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService,
  ) { }

  @Query()
  public async comments(
    @Context('user') user: Maybe<UserEntity>,
    @Args('id') id: string,
    @Args('query') query: GetPictureCommentListDto,
  ) {
    return this.commentService.getPictureList(id, query, user);
  }

  @Query('childComments')
  public async childCommentList(
    @Context('user') user: Maybe<UserEntity>,
    @Args('id') id: number,
    @Args('query') query: GetPictureCommentListDto,
  ) {
    return this.commentService.childComments(id, user, undefined, query);
  }

  @Mutation()
  @Roles(Role.USER)
  public async addComment(
    @ClientInfo() clientInfo: IClientInfo,
    @Context('user') user: UserEntity,
    @Args('id') id: number,
    @Args('commentId') commentId: number,
    @Args('data') data: CreatePictureCommentDot,
  ) {
    return this.commentService.create(clientInfo, user, data, id, commentId);
  }

  @ResolveField('childComments')
  public async childComments(
    @Parent() parent: CommentEntity,
    @Context('user') user: Maybe<UserEntity>,
    @Args('limit') limit?: number,
  ) {
    if (!parent || (parent && parent.parentComment)) return [];
    return this.commentService.childComments(parent.id, user, limit);
  }

  @ResolveField('subCount')
  public async subCount(
    @Parent() parent: CommentEntity,
  ) {
    if (!parent || (parent && parent.parentComment)) return 0;
    return this.commentService.getSubCount(parent.id);
  }
}
