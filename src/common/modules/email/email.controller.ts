import { Controller, Get } from '@nestjs/common';

import { EmailService } from './email.service';

@Controller('api/email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
  ) {}
  @Get()
  public async test() {
    return this.emailService.sendEmail('1103307414@qq.com');
  }
}
