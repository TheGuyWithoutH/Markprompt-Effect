import { Effect, pipe } from "effect";
import { KeyStoreClient } from "./redis.js";
import * as Api from "uuid";
import User, { parseUser } from "src/data/user.js";

/**
 * Stores a user in Redis as a hash.
 * The user is stored with a key formatted as `user:<id>`
 */
const storeUser = (user: User) =>
  Effect.gen(function* ($) {
    const store = yield* KeyStoreClient;

    const result = yield* Effect.tryPromise({
      try: async () => {
        // Define a key for the user in Redis
        const key = `user:${user.id}`;

        // Store the user properties as a hash.
        // Adjust the conversion of tier if needed.
        await store.hset(key, {
          id: user.id,
          username: user.username,
          tier: JSON.stringify(user.tier), // convert tier to a string if necessary
        });

        return user;
      },
      catch: (error) => new Error(`Failed to store user: ${error}`),
    });

    return result;
  });

/**
 * Retrieves a user from Redis by ID.
 * The user is stored with a key formatted as `user:<id>`
 */
const retrieveUser = (id: string) =>
  Effect.gen(function* ($) {
    const store = yield* KeyStoreClient;

    const result = yield* Effect.tryPromise({
      try: async () => {
        // Define a key for the user in Redis
        const key = `user:${id}`;

        // Retrieve the user properties as a hash.
        const userProps = await store.hgetall(key);

        // If the user was not found, return null
        if (userProps == null || Object.keys(userProps).length === 0) {
          throw new Error(`User with ID ${id} not found`);
        }

        // Convert the tier back to an object
        if (userProps.tier) {
          userProps.tier = JSON.parse(userProps.tier);
        }

        return userProps;
      },
      catch: (error) => new Error(`Failed to retrieve user: ${error}`),
    });

    return result;
  }).pipe(
    Effect.tap((user) => Effect.log(JSON.stringify(user))),
    Effect.flatMap(parseUser)
  );

const retrieveUsers = () =>
  Effect.gen(function* ($) {
    const store = yield* KeyStoreClient;

    const result = yield* Effect.tryPromise({
      try: async () => {
        // Get all keys that start with "user:"
        const keys = await store.keys("user:*");

        // Retrieve all users
        const users = await Promise.all(
          keys.map(async (key) => {
            // Retrieve the user properties as a hash.
            const userProps = await store.hgetall(key);

            // Convert the tier back to an enum if necessary
            // return new User(
            //   userProps.id,
            //   userProps.username,
            //   Tier.fromString(userProps.tier) // convert tier back to an enum if necessary
            // );

            return userProps;
          })
        );

        return users;
      },
      catch: (error) => new Error(`Failed to retrieve users: ${error}`),
    });

    return result;
  });

/**
 * Changes the tier of a user in Redis.
 * The user is stored with a key formatted as `user:<id>`
 */
const changeTier = (id: string, newTier: { limit: number }) =>
  pipe(
    Effect.gen(function* () {
      const store = yield* KeyStoreClient;
      const user = yield* retrieveUser(id);

      const result = yield* Effect.tryPromise({
        try: async () => {
          // Define a key for the user in Redis
          const key = `user:${id}`;

          // Change the tier of the user in Redis
          await store.hset(key, {
            id: user.id,
            username: user.username,
            tier: JSON.stringify(newTier), // convert tier to a string if necessary
          });
          return newTier;
        },
        catch: (error) => new Error(`Failed to change tier: ${error}`),
      });

      return result;
    })
  );

const createApiKey = (user_id: string) =>
  Effect.gen(function* ($) {
    const store = yield* KeyStoreClient;

    const uuid = yield* Effect.sync(() => Api.v7());

    yield* Effect.tryPromise({
      try: async () => {
        // Define a key for the user in Redis
        const key = `api:${uuid}`;

        // Store the api key properties as a hash.
        await store.hset(key, {
          user_id: user_id,
        });

        return key;
      },
      catch: (error) => new Error(`Failed to store user: ${error}`),
    });

    return uuid;
  });

const verifyApiKey = (key: string) =>
  Effect.gen(function* ($) {
    const store = yield* KeyStoreClient;

    const result = yield* Effect.tryPromise({
      try: async () => {
        // Retrieve the user properties as a hash.
        const keyProps = await store.hgetall("api:" + key);

        // If the user was not found, return null
        if (keyProps == null || Object.keys(keyProps).length === 0) {
          throw new Error(`Key not found:` + JSON.stringify(keyProps));
        }

        return keyProps.user_id;
      },
      catch: (error) => new Error(`Failed to retrieve user: ${error}`),
    });

    return result;
  });

export {
  storeUser,
  retrieveUser,
  retrieveUsers,
  createApiKey,
  verifyApiKey,
  changeTier,
};
