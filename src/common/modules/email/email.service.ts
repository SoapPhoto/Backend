import { Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import lodash from 'lodash';
import mjml2html from 'mjml';
import path from 'path';

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
    const string = fs.readFileSync(path.join(__dirname, `./template/${type}.html`)).toString();
    return lodash.template(string, options)({
      ...options,
      host: `http://${process.env.DATABASE_HOST}:${process.env.PORT}`,
    });
  }
  public async sendSignupEmail(identifier: string, verificationToken: string) {
    return this.transporter.sendMail({
      from: '"Fred Foo 👻" <1103307414@qq.com>',
      to: identifier,
      subject: '欢迎注册肥皂!',
      html: mjml2html(
        this.setMailContent('signup.validator', { identifier, verificationToken }),
      ).html,
    });
  }
}
