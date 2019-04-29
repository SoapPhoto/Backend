import { CacheInterceptor, Controller, Get, Query, Render, Res, UseGuards, UseInterceptors } from '@nestjs/common';

import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { ViewAuthGuard } from '@server/common/guard/view-auth.guard';
import { GetPictureListDto } from '@server/picture/dto/picture.dto';
import { PictureService } from '@server/picture/picture.service';
import { Maybe } from '@server/typing';
import { UserEntity } from '@server/user/user.entity';
import { Response } from 'express';

@Controller()
@UseInterceptors(CacheInterceptor)
@UseGuards(ViewAuthGuard)
export class ViewsController {
  constructor (
    private readonly pictureService: PictureService,
  ) {}
  @Get()
  @Render('Index')
  public async index(
    @User() user: Maybe<UserEntity>,
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
  @Roles('guest')
  public async login() {
    return {};
  }

  @Get('upload')
  @Render('upload')
  @Roles('user')
  public async upload(
    @User() user: Maybe<UserEntity>,
  ) {
    return {
      accountStore: {
        userInfo: user,
      },
    };
  }
}
