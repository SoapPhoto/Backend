import { CacheInterceptor, Controller, Get, Render, Res, UseGuards, UseInterceptors } from '@nestjs/common';

import { ViewAuthGuard } from '@server/common/guard/view-auth.guard';

@Controller()
@UseInterceptors(CacheInterceptor)
@UseGuards(ViewAuthGuard)
export class ViewsController {
  @Get()
  @Render('home')
  public async index() {
    return {};
  }

  @Get('user/:username')
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

  @Get('setting/:type(user|basic)')
  @Render('setting')
  public async setting() {
    return {};
  }
}
