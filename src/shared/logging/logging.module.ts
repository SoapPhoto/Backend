import {
  Global, Module,
} from '@nestjs/common';
import { LoggingService } from './logging.service';

// const globalRouteLogger: Provider = {
//   provide: APP_INTERCEPTOR,
//   useClass: LoggingInterceptor,
// };

@Global()
@Module({
  providers: [
    LoggingService,
  ],
  exports: [
    LoggingService,
  ],
})
export class LoggingModule {}
