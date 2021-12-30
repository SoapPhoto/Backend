import { Controller, Get } from '@nestjs/common';

import { EmailService } from './email.service';

@Controller('api/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  public async test() {
    // return this.emailService.sendSignupEmail('a1103307414@live.com');
  }
}
