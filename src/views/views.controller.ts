import { CacheInterceptor, Controller, Get, Query, Render, Res, UseInterceptors } from '@nestjs/common';

import { User } from '@server/common/decorator/user.decorator';
import { GetPictureListDto } from '@server/picture/dto/picture.dto';
import { PictureService } from '@server/picture/picture.service';
import { Maybe } from '@server/typing';
import { UserEntity } from '@server/user/user.entity';

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
      title: 'index',
    };
  }
  @Get('test')
  @Render('test')
  public async test(@Res() res) {
    return {};
  }
  @Get('picture/:id')
  @Render('picture')
  public async pictureDetail() {
    return {};
  }
}
