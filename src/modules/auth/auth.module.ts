import {
  forwardRef, Module, NestModule, MiddlewareConsumer,
} from '@nestjs/common';
import { UserModule } from '@server/modules/user/user.module';
import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { InvitationService } from './invitation/invitation.service';
import { AccessTokenModule } from '../oauth/access-token/access-token.module';
import { OauthModule } from '../oauth/oauth.module';


@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AccessTokenModule),
    forwardRef(() => OauthModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, InvitationService],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .forRoutes(AuthController);
  }
}
