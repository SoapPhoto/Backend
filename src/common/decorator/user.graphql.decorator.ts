import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (data, ctx) =>
    // const req = ctx.getRequest();
    ctx?.args[2]?.req?.user
  ,
);
