import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FollowResolver } from './follow.resolver';
import { FollowEntity } from './follow.entity';
import { FollowService } from './follow.service';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => NotificationModule),
  ],
  providers: [FollowResolver, FollowService],
  exports: [FollowService],
})
export class FollowModule {}
