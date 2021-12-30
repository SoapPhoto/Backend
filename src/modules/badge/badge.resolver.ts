import { Resolver, Mutation, Context, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from '@server/common/guard/auth.guard';
import { Roles } from '@server/common/decorator/roles.decorator';
import { BadgeType } from '@common/enum/badge';
import { Role } from '../user/enum/role.enum';
import { UserEntity } from '../user/user.entity';
import { BadgeService } from './badge.service';

@Resolver('Badge')
@UseGuards(AuthGuard)
export class BadgeResolver {
  constructor(private readonly badgeService: BadgeService) {}

  @Roles(Role.ADMIN, Role.OWNER)
  @Mutation()
  public async addBadge(
    @Context('user') user: UserEntity,
    @Args('type') type: BadgeType,
    @Args('badgeId') badgeId: number,
    @Args('targetId') targetId: number
  ) {
    await this.badgeService.addBadge(user, type, badgeId, targetId);
    return {
      done: true,
    };
  }

  @Query()
  public async getBadges(
    @Args('type') type: BadgeType,
    @Args('targetId') targetId: number
  ) {
    return this.badgeService.getBadges(type, targetId);
  }
}
