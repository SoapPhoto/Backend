import {
  Body, Controller, Post, Res, UseFilters, HttpCode, HttpStatus, UseGuards, Put, Req,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { CreateUserDto } from '@server/modules/user/dto/user.dto';
import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { AuthService } from './auth.service';
import { ValidatorEmailDto, ResetPasswordDto, NewPasswordDto } from './dto/auth.dto';
import { Role } from '../user/enum/role.enum';
import { UserEntity } from '../user/user.entity';
import { OauthServerService } from '../oauth/oauth-server/oauth-server.service';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const OAuth2Server = require('oauth2-server');

@Controller('api/auth')
@UseGuards(AuthGuard)
@UseFilters(new AllExceptionFilter())
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthServerService: OauthServerService,
  ) {}

  @Post('signup')
  public async signup(
    @Body() body: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.authService.emailSignup(body);
    const request = new OAuth2Server.Request({
      method: 'POST',
      headers: {
        ...req.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      query: {},
      body: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        grant_type: 'password',
        username: body.username,
        password: body.password,
      },
    });
    const response = new OAuth2Server.Response(res);
    const token = await this.oauthServerService.server.token(request, response);
    res.cookie('Authorization', `Bearer ${token.accessToken}`, {
      expires: token.accessTokenExpiresAt,
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
    });
    res.json(token);
  }

  @Post('logout')
  public async logout(
    @Res() res: Response,
  ) {
    res.clearCookie('Authorization', {
      domain: process.env.COOKIE_DOMAIN,
    });
    res.json();
  }

  @Post('validatorEmail')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async validatorEmail(
    @Body() body: ValidatorEmailDto,
  ) {
    return this.authService.validatorEmail(body);
  }

  @Post('resetMail')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async resetMail(
    @User() user: UserEntity,
  ) {
    return this.authService.resetMail(user);
  }

  @Put('resetPassword')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async resetPassword(
    @User() user: UserEntity,
    @Body() data: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(user, data);
  }

  @Put('newPassword')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async newPassword(
    @User() user: UserEntity,
    @Body() data: NewPasswordDto,
  ) {
    return this.authService.newPassword(user, data);
  }
}
