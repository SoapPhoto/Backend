import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { PictureModule } from '@server/picture/picture.module';
import { TagController } from './tag.controller';
import { TagEntity } from './tag.entity';
import { TagResolver } from './tag.resolvers';
import { TagService } from './tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagEntity]),
    forwardRef(() => PictureModule),
  ],
  providers: [TagService, TagResolver],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .forRoutes(TagController);
  }
}
