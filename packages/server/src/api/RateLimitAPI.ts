import { Effect } from "effect";
import { getUsersLimit } from "src/repository/rate-limit.js";

////////////////////////////////////////////////////////////
// Rate Limit API
////////////////////////////////////////////////////////////

const getRateStats = (req: Request) =>
  Effect.gen(function* () {
    const usersCount = yield* getUsersLimit(2, 60 * 1000);

    // Return a streaming Response
    return new Response(JSON.stringify(usersCount), {
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

export { getRateStats };
