import { Module } from '@nestjs/common';
import { InstagramController } from './instagram.controller';
import { InstagramService } from './instagram.service';

@Module({
  controllers: [InstagramController],
  providers: [InstagramService]
})
export class InstagramModule {}
