import {
  BadRequestException, Controller, Post, Req, Res, UnauthorizedException, UseFilters, Get, Param, Query,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { OauthTypeValues, OauthType } from '@common/enum/router';
import { OauthServerService } from './oauth-server/oauth-server.service';
import { OauthService } from './oauth.service';
import { OauthQueryDto } from './dto/oauth.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const OAuth2Server = require('oauth2-server');

@Controller('oauth')
@UseFilters(new AllExceptionFilter())
export class OauthController {
  constructor(
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
    let code = '';
    try {
      if (type.toUpperCase() === OauthType.GITHUB) {
        code = await this.oauthService.github(query);
      } else if (type.toUpperCase() === OauthType.GOOGLE) {
        code = await this.oauthService.google(query);
      }
      if (code) {
        res.redirect(`${process.env.URL}/redirect/oauth/${type || ''}?code=${code}&type=${type.toUpperCase()}`);
      } else {
        res.redirect(`${process.env.URL}/redirect/oauth/${type || ''}?type=${type.toUpperCase()}&message=no code`);
      }
    } catch (err) {
      res.redirect(`${process.env.URL}/redirect/oauth/${type || ''}?type=${type.toUpperCase()}&message=${err.message.message}`);
    }
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
        // domain: process.env.COOKIE_DOMAIN,
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
