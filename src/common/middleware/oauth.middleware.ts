import { Injectable, NestMiddleware } from '@nestjs/common';
import * as OAuth2Server from 'oauth2-server';

import { OauthServerService } from '@server/oauth/oauth-server/oauth-server.service';

@Injectable()
export class OauthMiddleware implements NestMiddleware {
  constructor(
    private readonly oauthServerService: OauthServerService,
  ) {}
  public async use(req: any, res: any, next: () => void) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    try {
      const token = await this.oauthServerService.server.authenticate(request, response);
      req.user = token.user;
    } catch (err) {
      req.user = null;
    }
    next();
  }
}
