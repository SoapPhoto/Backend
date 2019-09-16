import {
  Module, forwardRef, NestModule, MiddlewareConsumer,
} from '@nestjs/common';
import { QiniuModule } from '@server/shared/qiniu/qiniu.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileEntity } from './file.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    QiniuModule,
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([FileEntity]),
  ],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .forRoutes(FileController);
  }
}
