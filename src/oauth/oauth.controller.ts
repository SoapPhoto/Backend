import { BadRequestException, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as OAuth2Server from 'oauth2-server';

import { OauthServerService } from './oauth-server/oauth-server.service';

@Controller('oauth')
export class OauthController {
  constructor(
    private readonly oauthServerService: OauthServerService,
  ) {}

  @Post('/token')
  public async accessToken(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const request = new OAuth2Server.Request(req);
      const response = new OAuth2Server.Response(res);
      const token = await this.oauthServerService.server.token(request, response);
      res.cookie('Authorization', `Bearer ${token.accessToken}`, {
        expires: token.accessTokenExpiresAt,
        httpOnly: true,
      });
      res.json(token);
    } catch (err) {
      if (
        err instanceof OAuth2Server.OAuthError ||
        err instanceof OAuth2Server.InvalidArgumentError ||
        err instanceof OAuth2Server.ServerError
      ) {
        throw new UnauthorizedException(err.message);
      }
      throw new BadRequestException(err.message);
    }
  }
}
