import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { ClientController } from './client.controller';
import { ClientEntity } from './client.entity';
import { ClientService } from './client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity]),
  ],
  providers: [
    ClientService,
  ],
  controllers: [ClientController],
  exports: [
    ClientService,
  ],
})
export class ClientModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .forRoutes(ClientController);
  }
}
