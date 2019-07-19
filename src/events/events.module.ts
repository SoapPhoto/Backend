import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { OauthMiddleware } from '@server/common/middleware/oauth.middleware';
import { OauthModule } from '@server/oauth/oauth.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [OauthModule],
  providers: [
    EventsGateway,
  ],
  exports: [EventsGateway],
})
export class EventsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OauthMiddleware)
      .forRoutes(EventsGateway);
  }
}
