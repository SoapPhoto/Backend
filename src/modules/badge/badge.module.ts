import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadgeResolver } from './badge.resolver';
import { BadgeService } from './badge.service';
import { PictureBadgeActivityModule } from './picture-badge-activity/picture-badge-activity.module';
import { BadgeEntity } from './badge.entity';

@Module({
  providers: [BadgeResolver, BadgeService],
  imports: [
    TypeOrmModule.forFeature([BadgeEntity]),
    PictureBadgeActivityModule,
  ],
  exports: [BadgeService],
})
export class BadgeModule {}
