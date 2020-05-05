import {
  Context, Query, Resolver, ResolveField, Subscription, Mutation, Parent,
} from '@nestjs/graphql';
import { isNumber } from 'class-validator';

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
  ) { }

  @Query()
  @Roles(Role.USER)
  public async userNotification(
    @Context('user') user: UserEntity,
  ) {
    return this.notificationService.getList(user);
  }

  @Query()
  @Roles(Role.USER)
  public async unreadNotificationCount(
    @Context('user') user: UserEntity,
  ) {
    const count = await this.notificationService.getUnReadCount(user);
    return {
      count,
    };
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

  @Mutation()
  @Roles(Role.USER)
  public async markNotificationReadAll(
    @Context('user') user: UserEntity,
  ) {
    return this.notificationService.markNotificationReadAll(user);
  }
}

@Resolver('NotificationMedia')
export class NotificationMediaResolver {
  @ResolveField('__resolveType')
  public async resolveType(
    @Parent() parent: any,
  ) {
    if (isNumber(parent.subCount)) {
      return 'Comment';
    }
    return 'Picture';
  }
}
