import {
  NestInterceptor, ExecutionContext, CallHandler, Injectable,
} from '@nestjs/common';
import 'rxjs/add/operator/map';
import { classToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  public intercept(_context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(map(data => classToPlain(data)));
  }
}
