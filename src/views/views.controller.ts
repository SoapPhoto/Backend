import {
  CacheInterceptor, Controller, Get, Query, Res, UseGuards, UseInterceptors,
} from '@nestjs/common';
import path from 'path';

import { AuthService } from '@server/modules/auth/auth.service';
import { ValidatorEmailDto } from '@server/modules/auth/dto/auth.dto';
import { ViewAuthGuard } from '@server/common/guard/view-auth.guard';
import { Response } from 'express';
import { NextResponse } from 'nest-next-module';

@Controller()
@UseInterceptors(CacheInterceptor)
@UseGuards(ViewAuthGuard)
export class ViewsController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Get()
  public async index(
    @Res() res: NextResponse,
  ) {
    return res.nextRender('/views/home');
  }

  @Get('@(:username)')
  public async user(
    @Res() res: NextResponse,
  ) {
    return res.nextRender('/views/user');
  }

  @Get('@:username/:type(like|collections)?')
  public async userType(
    @Res() res: NextResponse,
  ) {
    return res.nextRender('/views/user');
  }

  @Get('picture/:id([0-9]+)')
  public async pictureDetail(
    @Res() res: NextResponse,
  ) {
    return res.nextRender('/views/picture');
  }

  @Get('validatoremail')
  public async validatorEmail(
    @Query() query: ValidatorEmailDto,
    @Res() res: NextResponse,
  ) {
    await this.authService.validatorEmail(query);
    return res.nextRender('/views/picture');
  }

  @Get('login')
  public async login(
    @Res() res: NextResponse,
  ) {
    return res.nextRender('/views/auth/login');
  }

  @Get('signup')
  public async signup(
    @Res() res: NextResponse,
  ) {
    return res.nextRender('/views/auth/signup');
  }

  @Get('upload')
  public async upload(
    @Res() res: NextResponse,
  ) {
    return res.nextRender('/views/upload');
  }

  @Get('setting/:type(profile)')
  public async setting(
    @Res() res: NextResponse,
  ) {
    return res.nextRender('/views/setting');
  }

  @Get('setting/*')
  public async settingRedirect(
    @Res() res: NextResponse,
  ) {
    res.redirect('/setting/profile');
  }

  @Get('setting')
  public async settingIndex(
    @Res() res: NextResponse,
  ) {
    res.redirect('/setting/profile');
  }

  @Get('tag/:name')
  public async tagDetail(
    @Res() res: NextResponse,
  ) {
    return res.nextRender('/views/tag');
  }

  @Get('collection/:id')
  public async collectionDetail(
    @Res() res: NextResponse,
  ) {
    return res.nextRender('/views/collection');
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
