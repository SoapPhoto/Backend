import { createParamDecorator, InternalServerErrorException } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NEST_LOADER_CONTEXT_KEY, DataLoaderInterceptor } from './loader.interceptor';

/**
 * The decorator to be used within your graphql method.
 */
export const Loader = createParamDecorator(
  (data: string, [_, __, ctx]) => {
    if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
      throw new InternalServerErrorException(`
            You should provide interceptor ${DataLoaderInterceptor.name} globaly with ${APP_INTERCEPTOR}
          `);
    }

    return ctx[NEST_LOADER_CONTEXT_KEY](data);
  },
);
