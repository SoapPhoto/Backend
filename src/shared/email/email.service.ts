import { Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import lodash from 'lodash';
import mjml2html from 'mjml';
import path from 'path';

import { UserEntity } from '@server/user/user.entity';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  public transporter!: import('nodemailer/lib/mailer');

  constructor() {
    this.init();
  }

  public async init() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  public setMailContent(type: string, options: Record<string, string>) {
    const string = fs.readFileSync(path.join(__dirname, `./template/${type}.mjml`)).toString();
    return lodash.template(string)({
      ...options,
      host: `${process.env.URL}`,
    });
  }

  public async sendSignupEmail(identifier: string, verificationToken: string, userInfo: UserEntity) {
    return this.transporter.sendMail({
      from: `"Soap 👻" <${process.env.EMAIL_USER}>`,
      to: identifier,
      subject: '欢迎注册肥皂!',
      html: mjml2html(
        this.setMailContent('signup.validator', {
          identifier,
          verificationToken,
          username: userInfo.username,
          id: Buffer.from(userInfo.id.toString() as any).toString('base64').replace('=', ''),
        }),
      ).html,
    });
  }
}
