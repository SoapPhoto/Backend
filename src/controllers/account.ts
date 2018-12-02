import { Body, JsonController, Post } from 'routing-controllers';
import { Inject } from 'typedi';

import { AccessTokenService } from '@services/accessToken';
import { RefreshTokenService } from '@services/refreshToken';
import { UserService } from '@services/user';

export interface IUser {
  username: string;
  password: string;
  email: string;
}

@JsonController('/accounts')
export class AccountController {
  @Inject()
  public userService: UserService;

  @Inject()
  public accessTokenService: AccessTokenService;

  @Inject()
  public refreshTokenService: RefreshTokenService;

  @Post('/register')
  public async register(@Body() body: IUser) {
    await this.userService.add(body);
    return {
      message: 'ok',
    };
  }

  @Post('/signOut')
  public async signOut(@Body() body: any) {
    await Promise.all([
      this.accessTokenService.delete(body.accessToken),
      this.refreshTokenService.delete(body.refreshToken),
    ]);
    return {
      message: 'ok',
    };
  }
}
