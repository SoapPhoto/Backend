import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';

import { User } from '@server/common/decorator/user.decorator';
import { OauthServerService } from '@server/oauth/oauth-server/oauth-server.service';
import { GetPictureListDto } from '@server/picture/dto/picture.dto';
import { Maybe } from '@server/typing';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

// tslint:disable-next-line: no-var-requires
const OAuth2Server = require('oauth2-server');

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly oauthServerService: OauthServerService,
  ) {}

  @Get('me')
  public async getAccountInfo(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (req.cookies.Authorization) {
      req.headers.Authorization = req.cookies.Authorization;
    }
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    try {
      const token = await this.oauthServerService.server.authenticate(request, response);
      res.json(plainToClass(UserEntity, token.user));
    } catch (err) {
      res.json(null);
    }
  }
  @Get(':id([0-9]+)/picture')
  public async getUserIdPicture(
    @Param('id') id: string,
    @User() user: Maybe<UserEntity>,
    @Query() query: GetPictureListDto,
  ) {
    return this.userService.getUserPicture(id, query, user);
  }

  @Get(':name/picture')
  public async getUserNamePicture(
    @Param('name') username: string,
    @User() user: Maybe<UserEntity>,
    @Query() query: GetPictureListDto,
  ) {
    return this.userService.getUserPicture(username, query, user);
  }

  @Get(':id([0-9]+)')
  public async getIdInfo(
    @Param('id') id: string,
    @User() user: Maybe<UserEntity>,
  ) {
    return this.userService.getUser(id, user);
  }
  @Get(':name')
  public async getNameInfo(
    @Param('name') username: string,
    @User() user: Maybe<UserEntity>,
  ) {
    return this.userService.getUser(username, user);
  }
}
