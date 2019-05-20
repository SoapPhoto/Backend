import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (req) {
      const method = req.method;
      const url = req.url;

      Logger.log(
        `  <-- ${method} ${url}`,
        context.getClass().name,
        false,
      );
      return next.handle().pipe(
        tap(() =>
          Logger.log(
            `  --> ${method} ${url}`,
            context.getClass().name,
          ),
        ),
      );
    }
    return next.handle();
  }
}
