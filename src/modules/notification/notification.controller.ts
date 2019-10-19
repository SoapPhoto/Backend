import {
  Controller, UseFilters, Get, UseGuards, Post,
} from '@nestjs/common';
import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { User } from '@server/common/decorator/user.decorator';
import { Role } from '../user/enum/role.enum';
import { NotificationService } from './notification.service';
import { UserEntity } from '../user/user.entity';

@Controller('api/notification')
@UseGuards(AuthGuard)
@UseFilters(new AllExceptionFilter())
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  @Roles(Role.USER)
  public async getNotificationList(
    @User() user: UserEntity,
  ) {
    return this.notificationService.getList(user);
  }

  @Post('all')
  @Roles(Role.USER)
  public async markNotificationReadAll(
    @User() user: UserEntity,
  ) {
    return this.notificationService.markNotificationReadAll(user);
  }
}
