import { Global, Module } from '@nestjs/common';

import { BlurhashService } from './blurhash.service';

@Global()
@Module({
  providers: [BlurhashService],
  exports: [BlurhashService],
})
export class BlurhashModule {}
