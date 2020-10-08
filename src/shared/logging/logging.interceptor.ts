import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggingService,
  ) {
  }

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (req) {
      const { method } = req;
      const { url } = req;
      // 过滤掉next的一些无用路由信息
      if ((method === 'GET' && /^\/_next/.test(url)) || /^\/favicon.ico/.test(url)) {
        return next.handle();
      }
      this.logger.log(
        `  <-- ${method} ${url}`,
        context.getClass().name,
      );
      return next.handle().pipe(
        tap(() => this.logger.log(
          `  --> ${method} ${url}`,
          context.getClass().name,
        )),
      );
    }
    return next.handle();
  }
}
