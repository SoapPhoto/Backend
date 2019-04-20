import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessTokenEntity } from './access-token.entity';
import { AccessTokenService } from './access-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessTokenEntity]),
  ],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
