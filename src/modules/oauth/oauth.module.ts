import {
  forwardRef, Global, Module,
} from '@nestjs/common';

import { UserModule } from '@server/modules/user/user.module';
import { AccessTokenModule } from './access-token/access-token.module';
import { ClientModule } from './client/client.module';
import { OauthServerService } from './oauth-server/oauth-server.service';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    ClientModule,
    AccessTokenModule,
  ],
  exports: [OauthService, OauthServerService],
  controllers: [OauthController],
  providers: [OauthService, OauthServerService],
})
export class OauthModule {}
