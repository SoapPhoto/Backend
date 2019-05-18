import { Controller, Get, Param } from '@nestjs/common';
import { InstagramService } from './instagram.service';

@Controller('api/instagram')
export class InstagramController {
  constructor(
    private readonly instagramService: InstagramService,
  ) {}

  @Get()
  public async test() {
    return this.instagramService.test();
  }

  @Get(':id')
  public async test1(
    @Param('id') id: string,
  ) {
    return this.instagramService.test1(id);
  }
}
