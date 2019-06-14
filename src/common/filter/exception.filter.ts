import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

import { Logger } from '@server/shared/logging/logging.service';
import { validator } from '../utils/validator';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const done = (statusCode: number, message: any) => {
      Logger.error({
        message,
        statusCode,
        url: request.url,
      });
      response
        .status(statusCode)
        .json({
          message,
          statusCode,
        });
    };
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      done(status, validator.isString(message) ? message : (message as any).error);
    } else if (exception instanceof QueryFailedError) {
      done(500, exception.message);
    } else {
      done(500, exception.message);
    }
  }
}
