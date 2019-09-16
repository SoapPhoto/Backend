import {
  BadRequestException, Controller, Post, Req, Res, UnauthorizedException, UseFilters, Get, Param, Query,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { OauthServerService } from './oauth-server/oauth-server.service';
import { OauthType, OauthTypeValues } from './enum/oauth-type.enum';
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
    switch (type.toUpperCase()) {
      case OauthType.GITHUB:
        code = await this.oauthService.github(query);
        break;
      case OauthType.GOOGLE:
        code = await this.oauthService.google(query);
        break;
      default:
        break;
    }
    if (code) {
      res.redirect(`/oauth/${type || ''}?code=${code}`);
    } else {
      throw new UnauthorizedException();
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
        httpOnly: true,
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
