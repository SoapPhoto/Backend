import {
  CanActivate, ExecutionContext, forwardRef, Inject, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OauthServerService } from '@server/modules/oauth/oauth-server/oauth-server.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => OauthServerService))
    private readonly oauthServerService: OauthServerService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    // const isSocket = !!request.client;
    // if (isSocket) {
    //   const req = request as Socket;
    //   const { token } = req.handshake.query;
    //   console.log(req.handshake.headers, response);
    //   if (!token) {
    //     throw new WsException('error token');
    //   } else {
    //     try {
    //       const data = await this.oauthServerService.server.authenticate(
    //         new OAuth2Server.Request({
    //           method: 'get',
    //           query: {},
    //           headers: {
    //             ...parse(req.handshake.headers.cookie),
    //           },
    //         }),
    //         new OAuth2Server.Response(response),
    //       );
    //       if (data) {
    //         (req.handshake as any).user = data.user;
    //         return true;
    //       }
    //       throw new WsException('error token');
    //     } catch (err) {
    //       console.log(err);
    //     }
    //     return true;
    //   }
    // } else {
    // }
    let user;
    if (request) {
      ({ user } = request);
    } else {
      // graphql
      const ctx = GqlExecutionContext.create(context).getContext();
      ({ user } = ctx.req);
      ctx.user = user;
    }
    if (user) return true;
    throw new UnauthorizedException();
  }
}
