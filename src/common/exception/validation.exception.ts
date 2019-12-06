import { HttpStatus, HttpException } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(param: string, message: string) {
    super(
      {
        message: [{ param, message: [message] }],
      }, HttpStatus.BAD_REQUEST,
    );
  }
}
