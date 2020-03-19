import { Injectable, BadGatewayException, ForbiddenException } from '@nestjs/common';
import uniqid from 'uniqid';

import { UserService } from '@server/modules/user/user.service';
import { Role } from '@server/modules/user/enum/role.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { SignupType } from '@common/enum/signupType';
import { Status } from '@common/enum/userStatus';
import { ValidationException } from '@server/common/exception/validation.exception';
import { ValidatorEmailDto, ResetPasswordDto, NewPasswordDto } from './dto/auth.dto';
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
    const userInfo = await this.userService.findOne(id, null);
    if (userInfo) {
      if (userInfo.isVerified() || userInfo.signupType !== SignupType.EMAIL) {
        throw new BadGatewayException('verified');
      } else if (
        userInfo.identifier === identifier
        && userInfo.verificationToken === verificationToken
      ) {
        await this.userService.updateUser(userInfo, {
          status: Status.VERIFIED,
          isEmailVerified: true,
        });
        return;
      }
    }
    throw new BadGatewayException('verified_error');
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
    await this.sendValidator(newUser);
  }

  public async resetMail(user: UserEntity) {
    const userInfo = await this.userService.findOne(user.id, null);
    if (!userInfo) {
      throw new BadGatewayException('no_user');
    }
    if (userInfo.isVerified()) {
      throw new BadGatewayException('verified');
    } else {
      await this.sendValidator(userInfo);
    }
  }

  public async resetPassword(user: UserEntity, { password, newPassword }: ResetPasswordDto) {
    if (await this.userService.verifyUser(user.username, password)) {
      const newPasswordData = await this.userService.getPassword(newPassword);
      await this.userService.updateUser(user, newPasswordData);
      await this.accessTokenService.clearUserTokenAll(user.id);
    } else {
      throw new ValidationException('password', 'password_error');
    }
  }

  public async newPassword(user: UserEntity, { newPassword }: NewPasswordDto) {
    if (user.isPassword) {
      throw new ForbiddenException('no_password');
    }
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
