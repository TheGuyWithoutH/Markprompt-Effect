import { Effect, pipe, Schedule, Stream } from "effect";
import { RateError, rateLimit } from "src/repository/rate-limit.js";
import { retrieveUser, verifyApiKey } from "src/repository/user.js";

////////////////////////////////////////////////////////////////
// API for Chatbot Generator
////////////////////////////////////////////////////////////////

// Simulated AI chatbot response generator
const simulateChatbotResponse = (query: string) =>
  Stream.fromIterable([
    `Received query: "${query}"`,
    "Thinking...",
    "Processing the request...",
    "Generating response...",
    `Hi! How can I help you with "${query}" ?`,
  ]).pipe(
    Stream.map((message) => `${message}\n`),
    Stream.schedule(Schedule.spaced("1 second"))
  ); // Delay each chunk by 1000ms);

const genChat = (req: Request) =>
  pipe(
    Effect.tryPromise(() => req.json()), // Get query from body
    Effect.flatMap((query) =>
      Effect.all([
        Effect.succeed(query.query as string),
        verifyApiKey(query.api), // Verify API key
      ])
    ),
    Effect.flatMap(
      ([query, userId]) =>
        Effect.all([Effect.succeed(query), retrieveUser(userId)]) // Get user limit
    ),
    Effect.tap(
      ([_, user]) => rateLimit("rate:" + user.id, user.tier.limit, 60 * 1000) // Apply rate limit
    ),
    Effect.map(([query, _]) =>
      pipe(
        simulateChatbotResponse(query),
        Stream.map((chunk) => new TextEncoder().encode(chunk)),
        Stream.toReadableStream() // Convert Effect Stream to Web ReadableStream
      )
    ),
    Effect.map(
      (responseStream) =>
        new Response(responseStream, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
            "Access-Control-Allow-Origin": "*",
          },
        })
    ),
    Effect.catchAll((error) => {
      if (error instanceof RateError) {
        return Effect.succeed(
          new Response("Rate limit exceeded", {
            status: 429,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Expose-Headers": "*",
              "Retry-After": error.waitingTime.toString(),
            },
          })
        );
      } else {
        return Effect.succeed(
          new Response(`Error: ${error.message}`, {
            status: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          })
        );
      }
    })
  );

////////////////////////////////////////////////////////////////
// API for Chat Storage (Not Finished)
////////////////////////////////////////////////////////////////

const getChat = (req: Request) =>
  Effect.gen(function* () {
    const query = yield* Effect.tryPromise(() => req.json()); // Get query from body

    // Create a stream of chatbot responses
    const responseStream = pipe(
      simulateChatbotResponse(query),
      Stream.map((chunk) => new TextEncoder().encode(chunk)),
      Stream.toReadableStream() // Convert Effect Stream to Web ReadableStream
    );

    // Return a streaming Response
    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }).pipe(
    Effect.catchAll((error) =>
      Effect.succeed(new Response(`Error: ${error.message}`, { status: 500 }))
    )
  );

const getChats = (req: Request) =>
  Effect.gen(function* () {
    const query = yield* Effect.tryPromise(() => req.text()); // Get query from body

    // Create a stream of chatbot responses
    const responseStream = pipe(
      simulateChatbotResponse(query),
      Stream.map((chunk) => new TextEncoder().encode(chunk)),
      Stream.toReadableStream() // Convert Effect Stream to Web ReadableStream
    );

    // Return a streaming Response
    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }).pipe(
    Effect.catchAll((error) =>
      Effect.succeed(new Response(`Error: ${error.message}`, { status: 500 }))
    )
  );

const saveChat = (req: Request) =>
  Effect.gen(function* () {
    const query = yield* Effect.tryPromise(() => req.text()); // Get query from body

    // Create a stream of chatbot responses
    const responseStream = pipe(
      simulateChatbotResponse(query),
      Stream.map((chunk) => new TextEncoder().encode(chunk)),
      Stream.toReadableStream() // Convert Effect Stream to Web ReadableStream
    );

    // Return a streaming Response
    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }).pipe(
    Effect.catchAll((error) =>
      Effect.succeed(new Response(`Error: ${error.message}`, { status: 500 }))
    )
  );

const deleteChat = (req: Request) =>
  Effect.gen(function* () {
    const query = yield* Effect.tryPromise(() => req.text()); // Get query from body

    // Create a stream of chatbot responses
    const responseStream = pipe(
      simulateChatbotResponse(query),
      Stream.map((chunk) => new TextEncoder().encode(chunk)),
      Stream.toReadableStream() // Convert Effect Stream to Web ReadableStream
    );

    // Return a streaming Response
    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  }).pipe(
    Effect.catchAll((error) =>
      Effect.succeed(new Response(`Error: ${error.message}`, { status: 500 }))
    )
  );

export { getChat, getChats, saveChat, genChat, deleteChat };
