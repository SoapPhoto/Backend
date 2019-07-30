import { Injectable } from '@nestjs/common';

import { UserEntity } from '@server/user/user.entity';
import { UserService } from '@server/user/user.service';
import { plainToClass } from 'class-transformer';
import { ValidatorEmailDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) {}

  public async validatoremail(query: ValidatorEmailDto) {
    const { identifier, verificationToken } = query;
    const id = Buffer.from(`${query.id}=`, 'base64').toString('ascii');
    const userInfo = await this.userService.getUser(id, null, ['admin']);
    let message = '';
    if (userInfo) {
      if (userInfo.verified || userInfo.signupType !== 'email') {
        message = 'activated';
      } else if (
        userInfo.identifier === identifier
        && userInfo.verificationToken === verificationToken
      ) {
        await this.userService.updateUser(userInfo, {
          verified: true,
        });
        message = 'ok';
      }
    }
    message = 'failure';
    return {
      message,
      user: plainToClass(UserEntity, userInfo),
    };
  }
}
