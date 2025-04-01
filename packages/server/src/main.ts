import { Effect } from "effect";
import {
  deleteChat,
  genChat,
  getChat,
  getChats,
  saveChat,
} from "./api/ChatAPI.js";
import { getRateStats } from "./api/RateLimitAPI.js";
import { createUser, getUser, getUsers } from "./api/UserAPI.js";
import { KeyStoreClient, redisClient } from "./repository/redis.js";

// Connect to Redis
Effect.runPromise(
  Effect.gen(function* ($) {
    const store = yield* KeyStoreClient;
    return store.connect();
  }).pipe(redisClient)
);

/**
 * Server example
 */
Bun.serve({
  // `routes` requires Bun v1.2.3+
  routes: {
    // Chatbot response generator
    "/chat-generate": {
      POST: async (req: Request): Promise<Response> => {
        const response = await Effect.runPromise(
          genChat(req).pipe(redisClient)
        );
        return response;
      },
    },
    // Save chat
    "/save-chat": {
      POST: async (req: Request): Promise<Response> => {
        const response = await Effect.runPromise(
          saveChat(req).pipe(redisClient)
        );
        return response;
      },
    },
    // Get a user chat
    "/get-chat/:id": {
      GET: async (req: Request): Promise<Response> => {
        const response = await Effect.runPromise(
          getChat(req).pipe(redisClient)
        );
        return response;
      },
    },
    // Get all chats for a user
    "/get-chats/:userId": {
      GET: async (req: Request): Promise<Response> => {
        const response = await Effect.runPromise(
          getChats(req).pipe(redisClient)
        );
        return response;
      },
    },
    // Delete a chat
    "/delete-chat/:id": {
      DELETE: async (req: Request): Promise<Response> => {
        const response = await Effect.runPromise(
          deleteChat(req).pipe(redisClient)
        );
        return response;
      },
    },
    // Rate limit stats
    "/rate-limit-stats": {
      GET: async (req: Request): Promise<Response> => {
        const response = await Effect.runPromise(
          getRateStats(req).pipe(redisClient)
        );
        return response;
      },
    },
    // Create account
    "/create-account": {
      POST: async (req: Request): Promise<Response> => {
        const response = await Effect.runPromise(
          createUser(req).pipe(redisClient)
        );
        return response;
      },
    },
    // Create account
    "/get-account/:id": {
      GET: async (req: Request): Promise<Response> => {
        const response = await Effect.runPromise(
          getUser(req).pipe(redisClient)
        );
        return response;
      },
    },
    // Create account
    "/get-users": {
      GET: async (req: Request): Promise<Response> => {
        const response = await Effect.runPromise(
          getUsers(req).pipe(redisClient)
        );
        return response;
      },
    },
    // Change subscription of an account
    // "/change-tier": {
    //   POST: async (req: Request): Promise<Response> => {
    //     const response = await Effect.runPromise(changeTierUser(req));
    //     return response;
    //   },
    // },
  },

  // (optional) fallback for unmatched routes:
  // Required if Bun's version < 1.2.3
  fetch(req: Request) {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const res = new Response("Not found", { status: 404 });
    return res;
  },
});
