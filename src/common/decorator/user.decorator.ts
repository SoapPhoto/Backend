import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  const type = ctx.getType();
  if (type === ('graphql' as string)) {
    const context = GqlExecutionContext.create(ctx).getContext();
    return context?.user || null;
  }
  return ctx.switchToHttp().getRequest().user;
});
