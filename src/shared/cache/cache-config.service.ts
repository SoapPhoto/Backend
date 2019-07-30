import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  public retryStrategy() {
    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      retry_strategy: (options: any) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60) {
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 2) {
          return new Error('Max attempts exhausted');
        }
        return Math.min(options.attempt * 100, 3000);
      },
    };
  }

  public createCacheOptions(): CacheModuleOptions {
    return {};
  }
}
