import DataLoader from 'dataloader';
import {
  NestInterceptor, ExecutionContext, CallHandler, InternalServerErrorException, Injectable,
} from '@nestjs/common';

import { ModuleRef } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

/**
 * This interface will be used to generate the initial data loader.
 * The concrete implementation should be added as a provider to your module.
 */
export interface INestDataLoader<ID, Type> {
  /**
     * Should return a new instance of dataloader each time
     */
  generateDataLoader(): DataLoader<ID, Type>;
}

/**
 * Context key where get loader function will be stored.
 * This class should be added to your module providers like so:
 * {
 *     provide: APP_INTERCEPTOR,
 *     useClass: DataLoaderInterceptor,
 * },
 */
export const NEST_LOADER_CONTEXT_KEY = 'NEST_LOADER_CONTEXT_KEY';

@Injectable()
export class DataLoaderInterceptor implements NestInterceptor {
  constructor(
    private readonly moduleRef: ModuleRef,
  ) { }

  /**
     * @inheritdoc
     */
  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const graphqlExecutionContext = GqlExecutionContext.create(context);
    const ctx: any = graphqlExecutionContext.getContext();

    if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
      ctx[NEST_LOADER_CONTEXT_KEY] = (type: string): INestDataLoader<any, any> => {
        if (ctx[type] === undefined) {
          try {
            ctx[type] = this.moduleRef
              .get<INestDataLoader<any, any>>(type, { strict: false })
              .generateDataLoader();
          } catch (e) {
            throw new InternalServerErrorException(`The loader ${type} is not provided`);
          }
        }

        return ctx[type];
      };
    }
    return next.handle();
  }
}
