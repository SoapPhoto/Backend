import {
  BadRequestException, Controller, Post, Req, Res, UnauthorizedException, UseFilters, Get, Param, Query, Body,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { OauthTypeValues, OauthType } from '@common/enum/router';
import { LoggingService } from '@server/shared/logging/logging.service';
import { OauthActionType } from '@common/enum/oauthState';
import { OauthServerService } from './oauth-server/oauth-server.service';
import { OauthService } from './oauth.service';
import { OauthQueryDto, ActiveUserDto } from './dto/oauth.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const OAuth2Server = require('oauth2-server');

@Controller('oauth')
@UseFilters(new AllExceptionFilter())
export class OauthController {
  constructor(
    private readonly logger: LoggingService,
    private readonly oauthServerService: OauthServerService,
    private readonly oauthService: OauthService,
  ) {}

  @Post('/token')
  public async accessToken(
  @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.token(req, res);
  }

  @Post(`/:type(${OauthTypeValues.join('|')})/token`)
  public async oauthToken(
  @Param('type') type: OauthType,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.token(req, res, type);
  }

  @Get(`/:type(${OauthTypeValues.join('|')})/redirect`)
  public async oauthRedirect(
  @Param('type') type: OauthType,
    @Query() query: OauthQueryDto,
    @Res() res: Response,
  ) {
    let data: { code: string; action: OauthActionType } | null = null;
    try {
      if (type.toUpperCase() === OauthType.GITHUB) {
        data = await this.oauthService.github(query);
      } else if (type.toUpperCase() === OauthType.GOOGLE) {
        data = await this.oauthService.google(query);
      } else if (type.toUpperCase() === OauthType.WEIBO) {
        data = await this.oauthService.weibo(query);
      }
      if (data) {
        res.redirect(`${process.env.URL}/redirect/oauth/${type || ''}?code=${data.code}&type=${type.toUpperCase()}&action=${data.action}`);
      } else {
        res.redirect(`${process.env.URL}/redirect/oauth/${type || ''}?type=${type.toUpperCase()}&message=no code`);
      }
    } catch (err) {
      console.log(err.error);
      const message = err?.response?.data?.error ?? err.message.message;
      this.logger.error(message, undefined, `OAUTH-${type.toUpperCase()}`);
      res.redirect(`${process.env.URL}/redirect/oauth/${type || ''}?type=${type.toUpperCase()}&message=${message}`);
    }
  }

  @Post('/active')
  public async active(
  @Body() body: ActiveUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { type } = await this.oauthService.activeUser(body);
    return this.token(req, res, type);
  }

  private token = async (req: Request, res: Response, type?: OauthType) => {
    try {
      const request = new OAuth2Server.Request(req);
      const response = new OAuth2Server.Response(res);
      let token;
      if (type) {
        token = await this.oauthServerService.generateOauthToken(request, response, type);
      } else {
        token = await this.oauthServerService.server.token(request, response);
      }
      res.cookie('Authorization', `Bearer ${token.accessToken}`, {
        expires: token.accessTokenExpiresAt,
        domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
        path: '/',
      });
      res.json(token);
    } catch (err) {
      if (
        err instanceof OAuth2Server.OAuthError
        || err instanceof OAuth2Server.InvalidArgumentError
        || err instanceof OAuth2Server.ServerError
        || err instanceof UnauthorizedException
      ) {
        throw new UnauthorizedException(err.message);
      }
      throw new BadRequestException(err.message);
    }
  }
}
