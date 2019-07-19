import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@server/user/user.module';
import { AccessTokenEntity } from './access-token.entity';
import { AccessTokenService } from './access-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessTokenEntity]),
    forwardRef(() => UserModule),
  ],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
