import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((_, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user);
