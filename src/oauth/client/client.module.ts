import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientController } from './client.controller';
import { ClientEntity } from './client.entity';
import { ClientService } from './client.service';
import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';

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
