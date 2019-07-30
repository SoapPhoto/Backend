import {
  Body, Controller, Post, Res, UseFilters,
} from '@nestjs/common';
import { Response } from 'express';

import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { CreateUserDto } from '@server/user/dto/user.dto';
import { UserService } from '@server/user/user.service';

@Controller('auth')
@UseFilters(new AllExceptionFilter())
export class AuthController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  public async signup(
    @Body() body: CreateUserDto,
  ) {
    const data = await this.userService.signup(body);
    return data;
  }

  @Post('logout')
  public async logout(
    @Res() res: Response,
  ) {
    res.clearCookie('Authorization');
    res.json();
  }
}
