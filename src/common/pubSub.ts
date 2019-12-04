import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const options: Redis.RedisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  db: Number(process.env.REDIS_DB),
  password: process.env.REDIS_PASSWORD,
  keyPrefix: process.env.REDIS_PREFIX,
};

export const pubSub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});
