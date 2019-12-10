import {
  Resolver, Context, Args, Mutation, Query,
} from '@nestjs/graphql';
import {
  forwardRef, Inject, BadGatewayException, UseGuards,
} from '@nestjs/common';

import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { FollowService } from './follow.service';
import { UserEntity } from '../user/user.entity';
import { Role } from '../user/enum/role.enum';
import { FollowUserDto, FollowUsersDto } from './dto/follow.dto';

@Resolver('Follow')
@UseGuards(AuthGuard)
export class FollowResolver {
  constructor(
    @Inject(forwardRef(() => FollowService))
    private readonly followService: FollowService,
  ) {}

  @Query()
  public async followerUsers(
    @Args('id') id: ID,
    @Args() input: FollowUsersDto,
  ) {
    return this.followService.followUsers(id, input);
  }

  @Query()
  public async followedUsers(
    @Args('id') id: ID,
    @Args() input: FollowUsersDto,
  ) {
    return this.followService.followUsers(id, input, 'followed');
  }

  @Mutation()
  @Roles(Role.USER)
  public async followUser(
    @Context('user') user: UserEntity,
    @Args('input') input: FollowUserDto,
  ) {
    if (user.id === input.userId) {
      throw new BadGatewayException('no follow me');
    }
    if (await this.followService.isFollowing(user, input.userId)) {
      throw new BadGatewayException('followed');
    }
    await this.followService.create(user.id, input.userId);
    return { done: true };
  }

  @Mutation()
  @Roles(Role.USER)
  public async unFollowUser(
    @Context('user') user: UserEntity,
    @Args('input') input: FollowUserDto,
  ) {
    if (user.id === input.userId) {
      throw new BadGatewayException('no unFollow me');
    }
    await this.followService.remove(user.id, input.userId);
    return { done: true };
  }
}
