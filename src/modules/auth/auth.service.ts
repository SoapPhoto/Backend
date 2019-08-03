import { Injectable, BadGatewayException } from '@nestjs/common';
import uniqid from 'uniqid';

import { UserService } from '@server/modules/user/user.service';
import { Role } from '@server/modules/user/enum/role.enum';
import { MailerService } from '@nest-modules/mailer';
import { ValidatorEmailDto } from './dto/auth.dto';
import { SignupType } from '../user/enum/signup.type.enum';
import { Status } from '../user/enum/status.enum';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  public async validatoremail(query: ValidatorEmailDto) {
    const { identifier, verificationToken } = query;
    const id = Buffer.from(`${query.id}=`, 'base64').toString('ascii');
    const userInfo = await this.userService.getUser(id, null, [Role.ADMIN]);
    if (userInfo) {
      if (userInfo.isVerified() || userInfo.signupType !== SignupType.EMAIL) {
        throw new BadGatewayException('verified');
      } else if (
        userInfo.identifier === identifier
        && userInfo.verificationToken === verificationToken
      ) {
        await this.userService.updateUser(userInfo, {
          status: Status.VERIFIED,
        });
      }
    }
  }

  public async emailSignup(data: CreateUserDto) {
    await this.userService.isSignup(data.username, data.email);
    const info: MutablePartial<UserEntity> = {
      identifier: data.email,
      verificationToken: uniqid(),
    };
    const newUser = await this.userService.createUser({
      ...data,
      ...info,
    });
    const {
      identifier, verificationToken, username, id,
    } = newUser;
    await this.mailerService.sendMail({
      to: identifier,
      from: `"Soap 👻" <${process.env.EMAIL_USER}>`,
      subject: '欢迎注册肥皂!',
      template: 'signup.validator',
      context: {
        identifier,
        verificationToken,
        username,
        id: Buffer.from(id.toString() as any).toString('base64').replace('=', ''),
      },
    });
  }

  public async test() {
    await this.mailerService.sendMail({
      to: '1103307414@qq.com',
      from: '4049310@qq.com',
      subject: 'Testing Nest Mailermodule with template ✔',
      template: 'signup.validator',
      context: {
        identifier: 'test',
        verificationToken: 'test',
        username: 123123,
        id: 123123,
      },
    });
  }
}
