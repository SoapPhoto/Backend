import { ApiError } from '@utils/ApiError';
import { ValidationError } from 'class-validator';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { OAuthError } from '../oauth/utils/error';

export function handleError(error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {
  if (error instanceof QueryFailedError) {
    res.status(400).json({
      error,
    });
  } else if (error instanceof ApiError) {
    res.status(400).json(error);
  } else if (error instanceof OAuthError) {
    res.status(401).json(error);
  } else {
    res.status(400).json({
      error,
    });
  }
  console.error(123123123, error);
  next();
}
