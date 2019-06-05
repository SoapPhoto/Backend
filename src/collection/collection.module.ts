import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { CollectionController } from './collection.controller';
import { CollectionEntity } from './collection.entity';
import { CollectionService } from './collection.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollectionEntity]),
  ],
  providers: [CollectionService],
  controllers: [CollectionController],
  exports: [CollectionService],
})
export class CollectionModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .forRoutes(CollectionController);
  }
}
