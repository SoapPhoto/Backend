import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (data, [_root, _args, ctx, _info]) => ctx.user,
);
