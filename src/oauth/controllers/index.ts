import { Request, Response } from 'express';
import { Get, JsonController, Post, Req, Res } from 'routing-controllers';
import oauth from '..';

function test(req: any, res: any, next: any) {
  next();
}
@JsonController('/')
export class OauthController {

  @Get('token')
  @Post('token')
	public async token(@Req() req: Request, @Res() res: Response): Promise<any> {
    const data = await oauth.token(req, res);
    console.log(data);
    return '';
  }
}
