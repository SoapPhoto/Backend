import { Injectable, NestMiddleware } from '@nestjs/common';

import { OauthServerService } from '@server/modules/oauth/oauth-server/oauth-server.service';

import { Response } from 'express';
import * as OAuth2Server from 'oauth2-server';

@Injectable()
export class OauthMiddleware implements NestMiddleware {
  constructor(
    private readonly oauthServerService: OauthServerService,
  ) {}

  public async use(req: any, res: Response, next: () => void) {
    const isReq = /text\/html|application\/json/g.test(req.headers.accept || '');
    if (!isReq) {
      next();
      return;
    }
    // 处理cookie
    if (req.cookies.Authorization) {
      req.headers.Authorization = req.cookies.Authorization;
    }
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    try {
      const token = await this.oauthServerService.server.authenticate(request, response);
      console.log(token);
      req.user = token.user;
    } catch (err) {
      req.user = null;
    }
    next();
  }
}
