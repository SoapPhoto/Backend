import { User } from '@/common/decorator/user.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get(':id([0-9]+)/picture')
  public async getUserIdPicture(
    @Param('id') id: string,
    @User() user?: UserEntity,
  ) {
    return this.userService.getUserPicture(id, user);
  }

  @Get(':name/picture')
  public async getUserNamePicture(
    @Param('name') username: string,
    @User() user?: UserEntity,
  ) {
    return this.userService.getUserPicture(username, user);
  }

  @Get(':id([0-9]+)')
  public async getIdInfo(
    @Param('id') id: string,
    @User() user?: UserEntity,
  ) {
    return this.userService.getUser(id, user);
  }
  @Get(':name')
  public async getNameInfo(
    @Param('name') username: string,
    @User() user?: UserEntity,
  ) {
    return this.userService.getUser(username, user);
  }
}
