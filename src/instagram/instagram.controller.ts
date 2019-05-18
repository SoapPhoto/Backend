import { Controller, Get } from '@nestjs/common';
import { InstagramService } from './instagram.service';

@Controller('api/instagram')
export class InstagramController {
  constructor(
    private readonly instagramService: InstagramService,
  ) {}

  @Get()
  public test() {
    this.instagramService.test();
  }
}
