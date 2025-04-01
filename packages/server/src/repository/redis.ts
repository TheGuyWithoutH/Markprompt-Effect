import { createClient } from "redis";
import { Context, Effect } from "effect";

////////////////////////////////////////////
// General DB client
////////////////////////////////////////////

export class KeyStoreClient extends Context.Tag("KeyStoreClient")<
  KeyStoreClient,
  {
    readonly connect: () => Promise<void>;
    readonly disconnect: () => Promise<void>;

    // Redis db methods
    readonly zAdd: (
      key: string,
      options: { score: number; value: string }
    ) => Promise<number>;
    readonly zRemRangeByScore: (
      key: string,
      min: any,
      max: any
    ) => Promise<number>;
    readonly zCount: (key: string, min: any, max: any) => Promise<number>;
    readonly zRangeByScore: (
      key: string,
      min: any,
      max: any,
      options: { LIMIT: { offset: number; count: number } }
    ) => Promise<string[]>;
    readonly hset: (key: string, field: any) => Promise<number>;
    readonly hget: (key: string, field: string) => Promise<string>;
    readonly hgetall: (key: string) => Promise<{ [key: string]: string }>;
    readonly keys: (pattern: string) => Promise<string[]>;
  }
>() {}

////////////////////////////////////////////
// Redis client
////////////////////////////////////////////

// Create and connect your Redis client
const redis = createClient({ url: "redis://localhost:6379" });

const redisClient = Effect.provideService(KeyStoreClient, {
  connect: async function (): Promise<void> {
    await redis.connect();
  },
  disconnect: function (): Promise<void> {
    return redis.disconnect();
  },
  zAdd: function (
    key: string,
    options: { score: number; value: string }
  ): Promise<number> {
    return redis.zAdd(key, [{ score: options.score, value: options.value }]);
  },
  zRemRangeByScore: function (
    key: string,
    min: number,
    max: number
  ): Promise<number> {
    return redis.zRemRangeByScore(key, min, max);
  },
  zCount: function (key: string, min: any, max: any): Promise<number> {
    return redis.zCount(key, min, max);
  },
  zRangeByScore: function (
    key: string,
    min: any,
    max: any,
    options: { LIMIT: { offset: number; count: number } }
  ): Promise<string[]> {
    return redis.zRangeByScore(key, min, max, options);
  },
  hset: function (key: string, field: any): Promise<number> {
    return redis.hSet(key, field);
  },
  hget: function (key: string, field: string): Promise<string> {
    return redis.hGet(key, field) as Promise<string>;
  },
  hgetall: function (key: string): Promise<{ [key: string]: string }> {
    return redis.hGetAll(key);
  },
  keys: function (pattern: string): Promise<string[]> {
    return redis.keys(pattern);
  },
});

// Wrap Redis connection in an Effect
const connectRedis = Effect.tryPromise({
  try: () => redis.connect(),
  catch: (error) => new Error(`Redis connection failed: ${error}`),
});

const disconnectRedis = Effect.tryPromise({
  try: () => redis.disconnect(),
  catch: (error) => new Error(`Redis stop failed: ${error}`),
});

export { connectRedis, disconnectRedis, redisClient };
