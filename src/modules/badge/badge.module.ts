import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadgeResolver } from './badge.resolver';
import { BadgeService } from './badge.service';
import { PictureBadgeActivityModule } from './picture-badge-activity/picture-badge-activity.module';
import { BadgeEntity } from './badge.entity';
import { UserBadgeActivityModule } from './user-badge-activity/user-badge-activity.module';
import { BadgeUserLoader, BadgePictureLoader } from './badge.loader';

@Module({
  providers: [
    BadgeResolver,
    BadgeService,
    BadgeUserLoader,
    BadgePictureLoader,
  ],
  imports: [
    TypeOrmModule.forFeature([BadgeEntity]),
    PictureBadgeActivityModule,
    UserBadgeActivityModule,
  ],
  exports: [BadgeService],
})
export class BadgeModule {}
