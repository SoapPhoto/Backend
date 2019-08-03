import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '@server/modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { InvitationService } from './invitation/invitation.service';


@Module({
  imports: [
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, InvitationService],
  exports: [AuthService],
})
export class AuthModule {}
