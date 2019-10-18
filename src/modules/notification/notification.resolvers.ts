import {
  Context, Query, Resolver, ResolveProperty, Subscription,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { UserEntity } from '@server/modules/user/user.entity';
import { Roles } from '@server/common/decorator/roles.decorator';
import { NotificationService } from './notification.service';
import { Role } from '../user/enum/role.enum';
import { NotificationEntity } from './notification.entity';

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

  @Subscription(_returns => NotificationEntity, {
    filter: (payload, _var, context) => {
      const { req } = context;
      const { user } = req;
      return user.id.toString() === payload.subscribers.id.toString();
    },
  })
  @Roles(Role.USER)
  public async newNotification() {
    return this.notificationService.pubSub.asyncIterator('newNotification');
  }
}

@Resolver('NotificationMedia')
export class NotificationMediaResolver {
  @ResolveProperty('__resolveType')
  public async resolveType() {
    return 'Picture';
  }
}
