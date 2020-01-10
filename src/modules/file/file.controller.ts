import {
  Controller,
  Get,
  UseGuards,
  UseFilters,
  All,
  Body,
  Headers,
  Req,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Query,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from '@server/common/guard/auth.guard';
import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { Roles } from '@server/common/decorator/roles.decorator';
import { QiniuService } from '@server/shared/qiniu/qiniu.service';
import { Request } from 'express';
import { User } from '@server/common/decorator/user.decorator';
import { Role } from '../user/enum/role.enum';
import { FileService } from './file.service';
import { CreateFileDot, GetTokenDot } from './dto/file.dto';
import { UserEntity } from '../user/user.entity';

@Controller('api/file')
@UseGuards(AuthGuard)
@UseFilters(new AllExceptionFilter())
export class FileController {
  constructor(
    private readonly qiniuService: QiniuService,
    private readonly fileService: FileService,
  ) {}

  @Get('token')
  @Roles(Role.USER)
  public getUploadToken(
    @Query() callbackData: GetTokenDot,
    @User() user: UserEntity,
  ) {
    return this.qiniuService.createToken({
      ...callbackData,
      userId: user.id,
    });
  }

  @All('upload/callback')
  public uploadCallback(
    @Body() data: CreateFileDot,
    @Req() req: Request,
    @Headers('authorization') token: string,
  ) {
    if (this.qiniuService.isQiniuCallback(`https://${req.headers.host}${req.originalUrl}`, token) && data.userId) {
      try {
        return this.fileService.create(data);
      } catch (err) {
        this.qiniuService.deleteFile(data.key);
        throw err;
      }
    }
    this.qiniuService.deleteFile(data.key);
    throw new UnauthorizedException();
  }
}
