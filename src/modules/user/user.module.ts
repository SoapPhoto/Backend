import {
  forwardRef, MiddlewareConsumer, Module, NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { PictureModule } from '@server/modules/picture/picture.module';
import { CollectionModule } from '@server/modules/collection/collection.module';
import { QiniuModule } from '@server/shared/qiniu/qiniu.module';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserResolver } from './user.resolvers';
import { UserService } from './user.service';
import { FileModule } from '../file/file.module';
import { FollowModule } from '../follow/follow.module';
import { BadgeModule } from '../badge/badge.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => PictureModule),
    forwardRef(() => CollectionModule),
    forwardRef(() => FileModule),
    forwardRef(() => FollowModule),
    forwardRef(() => BadgeModule),
    forwardRef(() => QiniuModule),
    forwardRef(() => FileModule),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .forRoutes(UserController);
  }
}
