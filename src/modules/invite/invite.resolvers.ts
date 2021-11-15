import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';

import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { classToPlain } from 'class-transformer';
import { Role } from '../user/enum/role.enum';
import { UserEntity } from '../user/user.entity';
import { InviteService } from './invite.service';

@Resolver('Invite')
@UseGuards(AuthGuard)
export class InviteResolver {
  constructor(
    @Inject(forwardRef(() => InviteService))
    private readonly inviteService: InviteService,
  ) { }

  @Mutation()
  @Roles(Role.ADMIN, Role.OWNER)
  public async createInvite(
    @User() user: UserEntity,
  ) {
    // console.log(user);
    const data = await this.inviteService.create();
    return classToPlain(data, {
      groups: [Role.OWNER],
    });
  }
}
