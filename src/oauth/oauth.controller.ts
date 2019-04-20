import { Controller, Post, Req, Res } from '@nestjs/common';
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
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    const token = await this.oauthServerService.server.token(request, response);
    res.json(token);
  }
}
