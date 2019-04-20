import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.user);
    return true;
  }
}
