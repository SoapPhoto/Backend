import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PictureModule } from '@server/modules/picture/picture.module';
import { UserModule } from '@server/modules/user/user.module';
import { CommentController } from './comment.controller';
import { CommentEntity } from './comment.entity';
import { CommentResolver } from './comment.resolvers';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => PictureModule),
  ],
  providers: [CommentService, CommentResolver],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
