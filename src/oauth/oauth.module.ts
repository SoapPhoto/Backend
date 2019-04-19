import { Module } from '@nestjs/common';

import { UserModule } from '@/user/user.module';
import { ClientModule } from './client/client.module';
import { OauthServerService } from './oauth-server/oauth-server.service';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';

@Module({
  imports: [
    ClientModule,
    UserModule,
  ],
  controllers: [OauthController],
  providers: [OauthService, OauthServerService],
})
export class OauthModule {}
