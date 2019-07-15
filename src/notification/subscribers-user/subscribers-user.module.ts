import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationSubscribersUserEntity } from './subscribers-user.entity';
import { SubscribersUserService } from './subscribers-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationSubscribersUserEntity]),
  ],
  providers: [SubscribersUserService],
  exports: [SubscribersUserService],
})
export class SubscribersUserModule {}
