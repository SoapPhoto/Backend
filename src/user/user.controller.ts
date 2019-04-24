import { User } from '@/common/decorator/user.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get(':id([0-9]+)')
  public async getIdInfo(
    @Param('id') id: string,
    @User() user?: UserEntity,
  ) {
    return this.userService.getUserById(id, user);
  }
  @Get(':name')
  public async getNameInfo(
    @Param('name') username: string,
    @User() user?: UserEntity,
  ) {
    return this.userService.getUserByName(username, user);
  }
}
