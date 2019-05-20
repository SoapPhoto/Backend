import { Controller, Get } from '@nestjs/common';

@Controller('tag')
export class TagController {
  @Get()
  public getAll() {
    return [{}];
  }
}
