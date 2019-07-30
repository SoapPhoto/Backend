import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ViewAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const isGuest = roles.findIndex(role => role === 'guest') >= 0;
    if (isGuest) {
      if (request.user) {
        response.redirect(301, request.query.redirectUrl || '/');
        return false;
      }
      return true;
    }
    if (request.user) return true;
    response.redirect(301, `/login?redirectUrl=${request.url}`);
    return false;
  }
}
