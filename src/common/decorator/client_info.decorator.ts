import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export interface IClientInfo {
  ip?: string;
  ua?: string;
}

export const ClientInfo = createParamDecorator(
  (_: string, ctx: ExecutionContext): IClientInfo => {
    const type = ctx.getType();
    let req = null;
    if (type === 'http') {
      req = ctx.switchToHttp().getRequest<Request>();
    }
    if (type === ('graphql' as string)) {
      req = GqlExecutionContext.create(ctx).getContext().req;
    }
    if (req) {
      return {
        ip: (
          req.headers['x-forwarded-for'] ||
          req.headers['x-real-ip'] ||
          req.ip ||
          req.ips[0]
        ).replace('::ffff:', ''),
        ua: req.headers['user-agent'],
      };
    }
    return {
      ip: '',
      ua: '',
    };
  }
);
