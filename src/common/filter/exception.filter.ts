import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ValidationError, isString } from 'class-validator';

import { Logger } from '@server/shared/logging/logging.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const done = (statusCode: number, message: any, stack?: any) => {
      Logger.error({
        statusCode,
        url: request.url,
        method: request.method,
        // tslint:disable-next-line: object-shorthand-properties-first
        message,
        // tslint:disable-next-line: object-shorthand-properties-first
        stack,
      });
      response
        .status(statusCode)
        .json({
          statusCode,
          message,
        });
    };
    const doneRes = (res: any, stack?: any) => {
      Logger.error({
        url: request.url,
        method: request.method,
        ...res,
        stack,
      });
      response
        .status(res.statusCode)
        .json(res);
    };
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exRes = exception.getResponse() as any;
      if (isString(exRes)) {
        done(status, exRes, exception.stack);
      } else if (exRes.message) {
        if (Array.isArray(exRes.message)) {
          doneRes({
            statusCode: exRes.statusCode ?? status,
            error: 'Validation Error',
            message: this.formatValidatorClass(exRes.message),
          }, exception.stack);
        } else {
          doneRes(exRes, exception.stack);
        }
      } else {
        done(status, exRes.error);
      }
    } else if (exception instanceof QueryFailedError) {
      done(500, exception.message, exception.stack);
    } else {
      done(500, exception.message, exception.stack);
    }
  }

  private formatValidatorClass(errors: any[]) {
    const formatedErrors = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const msg of errors) {
      if (msg as any instanceof ValidationError) {
        const message = Object.values(msg.constraints);
        const err = { param: msg.property, message };
        formatedErrors.push(err);
      } else {
        formatedErrors.push(msg);
      }
    }
    return formatedErrors;
  }
}
