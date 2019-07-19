import { forwardRef, Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { UserModule } from '@server/user/user.module';
import { UserService } from '@server/user/user.service';
import { AccessTokenModule } from './access-token/access-token.module';
import { AccessTokenService } from './access-token/access-token.service';
import { ClientModule } from './client/client.module';
import { ClientService } from './client/client.service';
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
