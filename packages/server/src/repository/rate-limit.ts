import { Effect } from "effect";
import { KeyStoreClient } from "./redis.js";

export class RateError extends Error {
  readonly _tag = "HttpError";
  readonly waitingTime: number = 0;

  constructor(message: string, waitingTime: number) {
    super(message);
    this.waitingTime = waitingTime;
  }
}

// Function to add a timestamp to a sorted set (using a key per user or API)
const addTimestamp = (key: string, timestamp: number) =>
  Effect.gen(function* ($) {
    const store = yield* KeyStoreClient;
    return yield* Effect.tryPromise({
      try: () =>
        // Use zAdd to store the timestamp; both the score and the value are the timestamp.
        store.zAdd(key, { score: timestamp, value: timestamp.toString() }),
      catch: (error) => new Error(`Failed to add timestamp: ${error}`),
    });
  });

// Function to remove timestamps older than a given time (cleanup)
const removeOldTimestamps = (key: string, cutoff: number) =>
  Effect.gen(function* ($) {
    const store = yield* KeyStoreClient;
    return yield* Effect.tryPromise({
      try: () =>
        // Remove all entries with score less than cutoff (i.e. older than our window)
        store.zRemRangeByScore(key, 0, cutoff),
      catch: (error) => new Error(`Failed to remove old timestamps: ${error}`),
    });
  });

// Function to count timestamps within a time window for rate limiting
const countRecentTimestamps = (key: string, windowStart: number) =>
  Effect.gen(function* ($) {
    const store = yield* KeyStoreClient;
    return yield* Effect.tryPromise({
      try: async () => {
        // Count all entries with scores between windowStart and +inf
        const count = await store.zCount(key, windowStart, "+inf");

        // Get the oldest timestamp (the one with the smallest score >= windowStart)
        // Adjust the options for your client; some clients may use positional arguments instead.
        const oldestResults = await store.zRangeByScore(
          key,
          windowStart,
          "+inf",
          { LIMIT: { offset: 0, count: 1 } }
        );

        // If there is a result, take the first element as the oldest timestamp
        const oldestTimestamp =
          oldestResults.length > 0 ? parseInt(oldestResults[0]) : 0;

        return { count, oldestTimestamp };
      },
      catch: (error) => new Error(`Failed to count timestamps: ${error}`),
    });
  });

// A combined effect that applies rate limiting logic.
// For example, allow at most `limit` API calls in the past `windowMs` milliseconds.
const rateLimit = (key: string, limit: number, windowMs: number) =>
  Effect.gen(function* ($) {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old timestamps first
    yield* $(removeOldTimestamps(key, windowStart));

    // Count recent API calls
    const { count, oldestTimestamp } = yield* $(
      countRecentTimestamps(key, windowStart)
    );

    if (count >= limit) {
      // If limit exceeded, you can fail or handle it as needed
      yield* Effect.fail(
        new RateError(
          "Rate limit exceeded",
          Math.round((windowMs - (now - oldestTimestamp)) / 1000)
        )
      );
    } else {
      // Otherwise, record the new API call timestamp
      yield* $(addTimestamp(key, now));
      yield* Effect.succeed("API call recorded");
    }
  });

// Return the count for each user
const getUsersLimit = (limit: number, windowMs: number) =>
  Effect.gen(function* ($) {
    const store = yield* KeyStoreClient;

    // get all keys from redis
    const keys = yield* Effect.tryPromise({
      try: () => store.keys("rate:*"),
      catch: (error) => new Error(`Failed to get keys: ${error}`),
    });

    const now = Date.now();

    // get all counts
    const counts = yield* Effect.forEach(keys, (key) =>
      countRecentTimestamps(key, Date.now() - windowMs).pipe(
        Effect.map((c) => {
          return {
            user: key.split(":")[1],
            count: c.count,
            waitTime: Math.max(
              0,
              Math.round((windowMs - (now - c.oldestTimestamp)) / 1000)
            ),
          };
        })
      )
    );

    // return the count for each user
    return counts;
  });

export { rateLimit, getUsersLimit };
