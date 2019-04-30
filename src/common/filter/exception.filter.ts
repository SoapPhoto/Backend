import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  public catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    response
      .status(500)
      .json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        message: '1',
      });
  }
}
