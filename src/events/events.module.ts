import {
  Module,
} from '@nestjs/common';

import { OauthModule } from '@server/modules/oauth/oauth.module';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
  imports: [OauthModule],
  providers: [
    EventsGateway,
    EventsService,
  ],
  exports: [EventsGateway],
})
export class EventsModule {}
