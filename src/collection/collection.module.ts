import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';

@Module({
  providers: [CollectionService],
  controllers: [CollectionController]
})
export class CollectionModule {}
