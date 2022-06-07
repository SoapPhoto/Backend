import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';

const options: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  db: Number(process.env.REDIS_DB),
  password: process.env.REDIS_PASSWORD,
  keyPrefix: process.env.REDIS_PREFIX,
};

export const pubSub = new RedisPubSub({
  publisher: new Redis(options) as any,
  subscriber: new Redis(options) as any,
});
