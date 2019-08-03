import {
  Body, Controller, Post, Res, UseFilters, Put, HttpCode, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { CreateUserDto } from '@server/modules/user/dto/user.dto';
import { UserService } from '@server/modules/user/user.service';
import { AuthService } from './auth.service';
import { ValidatorEmailDto } from './dto/auth.dto';

@Controller('auth')
@UseFilters(new AllExceptionFilter())
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  public async signup(
    @Body() body: CreateUserDto,
  ) {
    const data = await this.authService.emailSignup(body);
    return data;
  }

  @Post('logout')
  public async logout(
    @Res() res: Response,
  ) {
    res.clearCookie('Authorization');
    res.json();
  }

  @Put('validatoremail')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async validatoremail(
    @Body() body: ValidatorEmailDto,
  ) {
    return this.authService.validatoremail(body);
  }

  @Post('test')
  public async test(
    // @Res() res: Response,
  ) {
    this.authService.test();
  }
}
