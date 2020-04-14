import { Global, Module } from '@nestjs/common';

import { IpService } from './ip.service';

@Global()
@Module({
  providers: [IpService],
  exports: [IpService],
})
export class IpModule {}
