import * as bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({
  type: 'before',
})
export class BodyParser implements ExpressMiddlewareInterface {

  private jsonBodyParser = bodyParser.urlencoded({ extended: true });

  public use(req: Request, res: Response, next: NextFunction) {
    this.jsonBodyParser(req, res, next);
  }
}
