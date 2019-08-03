import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';

@Module({
  providers: [OptionService],
  controllers: [OptionController],
})
export class OptionModule {}
