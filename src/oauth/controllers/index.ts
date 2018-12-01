import { Request, Response } from 'express';
import { Get, JsonController, Post, Req, Res, UseBefore } from 'routing-controllers';

import { BodyParser } from '../../middlewares/form';

import oauth from '..';

function test(req: any, res: any, next: any) {
  next();
}
@JsonController('/')
@UseBefore(BodyParser)
export class OauthController {

  @Get('token')
  @Post('token')
	public async token(@Req() req: Request, @Res() res: Response): Promise<any> {
    return await oauth.token(req, res);
  }
}
