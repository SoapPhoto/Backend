import { CacheInterceptor, Controller, Get, Render, UseGuards, UseInterceptors } from '@nestjs/common';

import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { ViewAuthGuard } from '@server/common/guard/view-auth.guard';
import { Maybe } from '@server/typing';
import { UserEntity } from '@server/user/user.entity';

@Controller()
@UseInterceptors(CacheInterceptor)
@UseGuards(ViewAuthGuard)
export class ViewsController {
  @Get()
  @Render('Index')
  public async index() {
    return {};
  }

  @Get('picture/:id')
  @Render('picture')
  public async pictureDetail() {
    return {};
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
}
