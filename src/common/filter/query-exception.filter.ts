import {
  ArgumentsHost, Catch, ExceptionFilter, HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

import { Logger } from '@server/shared/logging/logging.service';

@Catch(QueryFailedError)
export class QueryExceptionFilter implements ExceptionFilter {
  public catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    Logger.error(exception);
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        message: exception.message,
      });
  }
}
