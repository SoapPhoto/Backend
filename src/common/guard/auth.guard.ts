import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OauthServerService } from '@server/modules/oauth/oauth-server/oauth-server.service';
import { Role } from '@server/modules/user/enum/role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => OauthServerService))
    private readonly oauthServerService: OauthServerService,
    private readonly reflector: Reflector
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
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
      ({ user } = ctx);
      ctx.user = user;
    }
    // TODO: 暂时这样，以后完善权限
    if (user) {
      if (!roles.includes(user.role) && !roles.includes(Role.USER)) {
        throw new UnauthorizedException();
      }
      return true;
    }
    throw new UnauthorizedException();
  }
}
