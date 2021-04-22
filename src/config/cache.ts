import { RedisOptions } from 'ioredis';

export default {
  config: {
    redis: {
      host: 'locahost',
      port: 6379,
      password: undefined,
    },
  },
} as RedisOptions;
