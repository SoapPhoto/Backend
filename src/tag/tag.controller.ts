import {
  Controller, Get, Param, Query, UseFilters, UseGuards,
} from '@nestjs/common';

import { User } from '@server/common/decorator/user.decorator';
import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { UserEntity } from '@server/user/user.entity';
import { GetTagPictureListDto } from './dto/tag.dto';
import { TagService } from './tag.service';

@Controller('api/tag')
@UseGuards(AuthGuard)
@UseFilters(new AllExceptionFilter())
export class TagController {
  constructor(
    private readonly tagService: TagService,
  ) {}

  @Get(':name')
  public async getTagInfo(
    @Param('name') name: string,
    @User() user: UserEntity,
  ) {
    return this.tagService.getTagInfo(nameuser);
  }

  @Get(':name/picture')
  public async getTagPictureList(
    @Param('name') name: string,
    @User() user: UserEntity,
    @Query() query: GetTagPictureListDto,
  ) {
    return this.tagService.getTagPicture(name, user, query);
  }
}
