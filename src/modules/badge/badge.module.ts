import { Module } from '@nestjs/common';
import { BadgeResolver } from './badge.resolver';
import { BadgeService } from './badge.service';

@Module({
  providers: [BadgeResolver, BadgeService],
})
export class BadgeModule {}
