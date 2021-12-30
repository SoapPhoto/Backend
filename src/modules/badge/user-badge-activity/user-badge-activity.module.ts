import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBadgeActivityService } from './user-badge-activity.service';
import { UserBadgeActivityEntity } from './user-badge-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBadgeActivityEntity])],
  providers: [UserBadgeActivityService],
  exports: [UserBadgeActivityService],
})
export class UserBadgeActivityModule {}
