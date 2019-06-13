import { Global, Module, OnModuleInit, Provider } from '@nestjs/common';
import { APP_INTERCEPTOR, ModuleRef } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggingService } from './logging.service';

const globalRouteLogger: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: LoggingInterceptor,
};

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
