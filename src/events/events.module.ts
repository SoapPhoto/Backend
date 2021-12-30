import { Module, forwardRef } from '@nestjs/common';

import { OauthModule } from '@server/modules/oauth/oauth.module';
import { NotificationModule } from '@server/modules/notification/notification.module';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
  imports: [OauthModule, forwardRef(() => NotificationModule)],
  providers: [EventsGateway, EventsService],
  exports: [EventsGateway],
})
export class EventsModule {}
