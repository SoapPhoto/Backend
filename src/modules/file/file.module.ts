import { Module, forwardRef } from '@nestjs/common';
import { QiniuModule } from '@server/shared/qiniu/qiniu.module';
import { TypeOrmModule } from '@nestjs/typeorm';
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
export class FileModule {}
