import {
  Context, Query, Resolver, ResolveProperty,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { UserEntity } from '@server/modules/user/user.entity';
import { Roles } from '@server/common/decorator/roles.decorator';
import { NotificationService } from './notification.service';
import { Role } from '../user/enum/role.enum';

@Resolver('Notification')
@UseGuards(AuthGuard)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Query()
  @Roles(Role.USER)
  public async userNotification(
    @Context('user') user: UserEntity,
  ) {
    return this.notificationService.getList(user);
  }

  @ResolveProperty('media')
  public resolveType() {
    return 'Picture';
  }
}
