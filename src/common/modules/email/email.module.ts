import { Global, Module } from '@nestjs/common';

import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Global()
@Module({
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
