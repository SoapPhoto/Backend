import { Controller, Get, Param } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('api/tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
  ) {}

  @Get()
  public getAll() {
    return [{}];
  }
  @Get(':name/picture')
  public getTagPictureList(
    @Param('name') name: string,
  ) {
    this.tagService.getTagPicture(name);
  }
}
