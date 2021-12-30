import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { PictureModule } from '@server/modules/picture/picture.module';
import { UserModule } from '@server/modules/user/user.module';
import { CollectionController } from './collection.controller';
import { CollectionEntity } from './collection.entity';
import { CollectionService } from './collection.service';
import { CollectionPictureEntity } from './picture/collection-picture.entity';
import { CollectionResolver } from './collection.resolvers';

@Module({
  imports: [
    forwardRef(() => PictureModule),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([CollectionEntity, CollectionPictureEntity]),
  ],
  providers: [CollectionService, CollectionResolver],
  controllers: [CollectionController],
  exports: [CollectionService],
})
export class CollectionModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(OauthMiddleware).forRoutes(CollectionController);
  }
}
