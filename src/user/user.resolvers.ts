import { Context, Query, Resolver } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { UserEntity } from './user.entity';

@Resolver()
@UseGuards(AuthGuard)
export class UserResolver {
  @Query()
  @Roles('user')
  public whoami(
    @Context('user') user: UserEntity,
  ) {
    return user;
  }
}
