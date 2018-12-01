import { Body, JsonController, Post } from 'routing-controllers';
import { Inject } from 'typedi';

import { Client } from '@entities/Client';
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

  @Post('/register')
  public async register(@Body() body: IUser) {
    await this.userService.add(body);
    return {};
  }
}
