// eslint-disable-next-line @typescript-eslint/no-triple-slash-reference
/// <reference path="../../../typings/typing.d.ts" />

import { Injectable, NestMiddleware } from '@nestjs/common';

import { OauthServerService } from '@server/oauth/oauth-server/oauth-server.service';
import { UserEntity } from '@server/user/user.entity';
import { plainToClass } from 'class-transformer';

import { Request, Response } from 'express';
import * as OAuth2Server from 'oauth2-server';

@Injectable()
export class OauthMiddleware implements NestMiddleware {
  constructor(
    private readonly oauthServerService: OauthServerService,
  ) {}

  public async use(req: Request, res: Response, next: () => void) {
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
      req.user = plainToClass(UserEntity, token.user);
    } catch (err) {
      req.user = null;
    }
    next();
  }
}
