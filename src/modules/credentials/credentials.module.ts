import { Module, MiddlewareConsumer, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { UserModule } from '../user/user.module';
import { CredentialsEntity } from './credentials.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CredentialsEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [CredentialsController],
  providers: [CredentialsService],
  exports: [CredentialsService],
})
export class CredentialsModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .forRoutes(CredentialsController);
  }
}
