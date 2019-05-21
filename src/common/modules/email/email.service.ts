import { Injectable } from '@nestjs/common';
import mjml2html from 'mjml';

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
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  public async sendEmail(email: string) {
    return this.transporter.sendMail({
      from: '"Fred Foo 👻" <4049310@qq.com>',
      to: email,
      subject: 'Hello ✔',
      html: mjml2html('').html,
    });
  }
}
