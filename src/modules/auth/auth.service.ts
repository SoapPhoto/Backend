import { Injectable, BadGatewayException } from '@nestjs/common';
import uniqid from 'uniqid';

import { UserService } from '@server/modules/user/user.service';
import { Role } from '@server/modules/user/enum/role.enum';
import { MailerService } from '@nest-modules/mailer';
import { ValidatorEmailDto, ResetPasswordDto } from './dto/auth.dto';
import { SignupType } from '../user/enum/signup.type.enum';
import { Status } from '../user/enum/status.enum';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserEntity } from '../user/user.entity';
import { AccessTokenService } from '../oauth/access-token/access-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  public async validatorEmail(query: ValidatorEmailDto) {
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
        return;
      }
    }
    throw new BadGatewayException('verified error');
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
    this.sendValidator(newUser);
  }

  public async resetMail(user: UserEntity) {
    const userInfo = await this.userService.getUser(user.id, null, [Role.ADMIN]);
    if (!userInfo) {
      throw new BadGatewayException('no user');
    }
    if (userInfo.isVerified()) {
      throw new BadGatewayException('verified');
    } else {
      await this.sendValidator(userInfo);
    }
  }

  public async resetPassword(user: UserEntity, { newPassword }: ResetPasswordDto) {
    const newPasswordData = await this.userService.getPassword(newPassword);
    await this.userService.updateUser(user, newPasswordData);
    await this.accessTokenService.clearUserTokenAll(user.id);
  }

  private async sendValidator(user: UserEntity) {
    const {
      identifier, verificationToken, username, id,
    } = user;
    try {
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
    } catch (err) {
      throw new BadGatewayException(err.message);
    }
  }
}
