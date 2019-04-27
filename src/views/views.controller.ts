import { CacheInterceptor, Controller, Get, Query, Render, Res, UseInterceptors } from '@nestjs/common';

import { User } from '@server/common/decorator/user.decorator';
import { GetPictureListDto } from '@server/picture/dto/picture.dto';
import { PictureService } from '@server/picture/picture.service';
import { Maybe } from '@server/typing';
import { UserEntity } from '@server/user/user.entity';
import { Response } from 'express';

@Controller()
@UseInterceptors(CacheInterceptor)
export class ViewsController {
  constructor (
    private readonly pictureService: PictureService,
  ) {}
  @Get()
  @Render('Index')
  public async index(
    @User() user: Maybe<UserEntity>,
    @Query() query: GetPictureListDto,
  ) {
    const data = await this.pictureService.getList(user, query);
    return {
      data,
      accountStore: {
        userInfo: user,
      },
      title: 'index',
    };
  }
  @Get('test')
  @Render('test')
  public async test(
    @User() user: Maybe<UserEntity>,
    @Res() res,
  ) {
    return {
      accountStore: {
        userInfo: user,
      },
    };
  }
  @Get('picture/:id')
  @Render('picture')
  public async pictureDetail() {
    return {};
  }
  @Get('login')
  @Render('auth/login')
  public async login(
    @User() user: Maybe<UserEntity>,
    @Query('redirectUrl') redirectUrl: string,
    @Res() res: Response,
  ) {
    if (user) {
      res.redirect(301, redirectUrl || '/');
    }
    return {};
  }
}
