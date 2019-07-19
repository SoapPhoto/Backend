import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { WsException } from '@nestjs/websockets';
import { OauthServerService } from '@server/oauth/oauth-server/oauth-server.service';
import { Socket } from 'socket.io';

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
    const isSocket = !!request.client;
    if (isSocket) {
      const req = request as Socket;
      const token = req.handshake.query.token;
      if (!token) {
        throw new WsException('error token');
      } else {
        return true;
      }
    } else {
      let user;
      if (request) {
        user = request.user;
      } else {
        // graphql
        const ctx = GqlExecutionContext.create(context).getContext();
        user = ctx.user;
      }
      if (user) return true;
      throw new UnauthorizedException();
    }
  }
}
