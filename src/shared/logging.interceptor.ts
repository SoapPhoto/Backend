import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
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
      // catchError(err => throwError(err)),
    );
  }
}
