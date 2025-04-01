import { Effect, pipe } from "effect";
import { parseUser } from "src/data/user.js";
import {
  changeTier,
  createApiKey,
  retrieveUser,
  retrieveUsers,
  storeUser,
} from "src/repository/user.js";

const getUser = (req: Request) =>
  Effect.gen(function* () {
    // @ts-ignore
    const user = yield* retrieveUser(req.params.id);

    // Return a streaming Response
    return new Response(JSON.stringify(user), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }).pipe(
    Effect.catchAll((error) =>
      Effect.succeed(
        new Response(`Error: ${error.message}`, {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
      )
    )
  );

const getUsers = (req: Request) =>
  Effect.gen(function* () {
    const users = yield* retrieveUsers();

    // Return a streaming Response
    return new Response(JSON.stringify(users), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }).pipe(
    Effect.catchAll((error) =>
      Effect.succeed(
        new Response(`Error: ${error.message}`, {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
      )
    )
  );

const createUser = (req: Request) =>
  pipe(
    Effect.tryPromise(() => req.json()), // Get query from body
    Effect.flatMap(parseUser),
    Effect.flatMap(storeUser),
    Effect.map((user) => user.id),
    Effect.flatMap(createApiKey),
    Effect.map(
      (apiKey) =>
        new Response(apiKey, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        })
    ),
    Effect.catchAll((error) =>
      Effect.succeed(
        new Response(`Error: ${error.message}`, {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
      )
    )
  );

const changeTierUser = (req: Request) =>
  pipe(
    Effect.tryPromise(() => req.json()), // Get query from body
    Effect.map((body) => ({ id: body.id, newTier: body.newTier })),
    Effect.flatMap(({ id, newTier }) => changeTier(id, newTier)),
    Effect.map(
      () =>
        new Response("", {
          status: 204,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        })
    ),
    Effect.catchAll((error) =>
      Effect.succeed(
        new Response(`Error: ${error.message}`, {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
      )
    )
  );

export { getUser, getUsers, createUser, changeTierUser };
