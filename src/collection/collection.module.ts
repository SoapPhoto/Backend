import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { PictureModule } from '@server/picture/picture.module';
import { UserModule } from '@server/user/user.module';
import { CollectionController } from './collection.controller';
import { CollectionEntity } from './collection.entity';
import { CollectionService } from './collection.service';
import { CollectionPictureEntity } from './picture/collection-picture.entity';

@Module({
  imports: [
    PictureModule,
    UserModule,
    TypeOrmModule.forFeature([CollectionEntity, CollectionPictureEntity]),
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
