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
