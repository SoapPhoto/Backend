import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from '@/user/dto/user.dto';
import { UserService } from '@/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
  ) {}
  @Post('signup')
  public async signup(
    @Body() body: CreateUserDto,
  ) {
    const data = await this.userService.createUser(body);
    return data;
  }
}
