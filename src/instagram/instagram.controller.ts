import {
  Controller, Get, Param, UseFilters,
} from '@nestjs/common';
import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { InstagramService } from './instagram.service';

@Controller('api/instagram')
@UseFilters(new AllExceptionFilter())
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
