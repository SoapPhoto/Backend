import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}
  @Get('name/:username')
  public async getNameInfo(
    @Param('username') username: string,
  ) {
    return {};
  }
}
