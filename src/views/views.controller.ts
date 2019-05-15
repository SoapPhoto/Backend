import { CacheInterceptor, Controller, Get, Render, Res, UseGuards, UseInterceptors } from '@nestjs/common';

import { ViewAuthGuard } from '@server/common/guard/view-auth.guard';
import { Response } from 'express';

@Controller()
@UseInterceptors(CacheInterceptor)
@UseGuards(ViewAuthGuard)
export class ViewsController {
  @Get()
  @Render('home')
  public async index() {
    return {};
  }

  @Get('@(:username)')
  @Render('user')
  public async user() {
    return {};
  }

  @Get('picture/:id([0-9]+)')
  public async pictureDetail(
    @Res() res: any,
  ) {
    res.render('picture', {});
  }

  @Get('login')
  @Render('auth/login')
  public async login() {
    return {};
  }

  @Get('upload')
  @Render('upload')
  public async upload() {
    return {};
  }

  @Get('setting/:type(profile|basic)')
  @Render('setting')
  public async setting() {
    return {};
  }

  @Get('setting')
  public async settingIndex(
    @Res() res: Response,
  ) {
    res.redirect('/setting/profile');
  }
}
