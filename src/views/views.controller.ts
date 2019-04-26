import { CacheInterceptor, Controller, Get, Query, Render, UseInterceptors } from '@nestjs/common';

import { User } from '@/common/decorator/user.decorator';
import { GetPictureListDto } from '@/picture/dto/picture.dto';
import { PictureService } from '@/picture/picture.service';
import { Maybe } from '@/typing';
import { UserEntity } from '@/user/user.entity';

@Controller()
@UseInterceptors(CacheInterceptor)
export class ViewsController {
  constructor (
    private readonly pictureService: PictureService,
  ) {}
  @Get()
  @Render('Index')
  public async root(
    @User() user: Maybe<UserEntity>,
    @Query() query: GetPictureListDto,
  ) {
    const data = await this.pictureService.getList(user, query);
    return {
      data,
      title: 'index',
    };
  }
}
