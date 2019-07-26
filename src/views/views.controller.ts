import { CacheInterceptor, Controller, Get, Query, Render, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import path from 'path';

import { AuthService } from '@server/auth/auth.service';
import { ValidatorEmailDto } from '@server/auth/dto/auth.dto';
import { ViewAuthGuard } from '@server/common/guard/view-auth.guard';
import { Response } from 'express';

@Controller()
@UseInterceptors(CacheInterceptor)
@UseGuards(ViewAuthGuard)
export class ViewsController {
  constructor(
    private readonly authService: AuthService,
  ) {}

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

  @Get('@:username/:type(like)?')
  @Render('user')
  public async userType() {
    return {};
  }

  @Get('picture/:id([0-9]+)')
  public async pictureDetail(
    @Res() res: any,
  ) {
    res.render('picture', {});
  }

  @Get('validatoremail')
  @Render('auth/validatoremail')
  public async validatoremail(
    @Query() query: ValidatorEmailDto,
  ) {
    return this.authService.validatoremail(query);
  }

  @Get('login')
  @Render('auth/login')
  public async login() {
    return {};
  }

  @Get('signup')
  @Render('auth/signup')
  public async signup() {
    return {};
  }

  @Get('upload')
  @Render('upload')
  public async upload() {
    return {};
  }

  @Get('setting/:type(profile)')
  @Render('setting')
  public async setting() {
    return {};
  }

  @Get('setting/*')
  @Render('setting')
  public async settingRedirect(
    @Res() res: Response,
  ) {
    res.redirect('/setting/profile');
  }

  @Get('setting')
  public async settingIndex(
    @Res() res: Response,
  ) {
    res.redirect('/setting/profile');
  }

  @Get('tag/:name')
  @Render('tag')
  public async tagsIndex() {
    return {};
  }

  @Get('service-worker.js')
  public async serviceWorker(
    @Res() res: Response,
  ) {
    const data = path.join(process.cwd(), '.next', 'service-worker.js');
    res.sendFile(data);
  }

  @Get('favicon.ico')
  public async favicon(
    @Res() res: Response,
  ) {
    const data = path.join(process.cwd(), '/public/favicon.ico');
    res.sendFile(data);
  }
}
