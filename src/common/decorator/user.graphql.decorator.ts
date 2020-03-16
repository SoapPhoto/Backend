import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data, host) => {
    const type = host.getType();
    if (type === 'graphql') {
      const [, , req] = host.getArgs();
      return req?.user || null;
    }
  }
  // const req = ctx.getRequest();
  ,
);
