import { createParamDecorator, InternalServerErrorException } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { NEST_LOADER_CONTEXT_KEY, DataLoaderInterceptor } from './loader.interceptor';

/**
 * The decorator to be used within your graphql method.
 */
export const Loader = createParamDecorator(
  (data: string, ctx) => {
    const context = GqlExecutionContext.create(ctx).getContext();
    if (context[NEST_LOADER_CONTEXT_KEY] === undefined) {
      throw new InternalServerErrorException(`
            You should provide interceptor ${DataLoaderInterceptor.name} globaly with ${APP_INTERCEPTOR}
          `);
    }

    return context[NEST_LOADER_CONTEXT_KEY](data);
  },
);
