// src/api/chatApi.ts

import Chat from "@/data/chat";
import { Tier } from "@/data/tiers";
import User from "@/data/user";
import { getApiKeyCookie, setApiKeyCookie } from "@/lib/cookie";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Helper function to handle errors
const handleError = (error: unknown) => {
  throw new Error(
    typeof error === "string" ? error : "An error occurred while fetching data"
  );
};

/**
 * Chat API service for interacting with the backend
 */
export const ChatApi = {
  /**
   * Get a single chat response (streaming)
   * @param query The user's query string
   * @returns A readable stream of the chat response
   */
  getChat: async (id: string): Promise<Chat> => {
    try {
      const response = await fetch(`${API_BASE_URL}/getChat/${id}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Return the stream directly
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get all chats (streaming)
   * @param query Optional query string to filter chats
   * @returns A readable stream of chat data
   */
  getChats: async (query: string): Promise<ReadableStream> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: query,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      return response.body as ReadableStream;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Save a chat conversation
   * @param query The chat data to save
   * @returns A readable stream with the save response
   */
  saveChat: async (query: string): Promise<ReadableStream> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/save`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: query,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      return response.body as ReadableStream;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Generate a new chat response
   * @param query The prompt for generating a chat response
   * @returns A readable stream of the generated chat
   */
  genChat: async (query: string): Promise<ReadableStream> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api: getApiKeyCookie(),
          query,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.log(response.headers);
          throw new Error(
            "Rate limit exceeded, please try again in " +
              response.headers.get("Retry-After") +
              " seconds"
          );
        }
        throw new Error(`Server responded with status: ${response.status}`);
      }

      return response.body as ReadableStream;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a chat conversation
   * @param chatId The ID of the chat to delete
   * @returns A readable stream with the deletion response
   */
  deleteChat: async (chatId: string): Promise<ReadableStream> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: chatId,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      return response.body as ReadableStream;
    } catch (error) {
      return handleError(error);
    }
  },
};

export const RateLimitApi = {
  /**
   * Get rate limit stats
   * @returns A readable stream of the rate limit stats
   */
  getRateStats: async (): Promise<
    {
      user: string;
      count: number;
      waitTime: number;
    }[]
  > => {
    try {
      const response = await fetch(`${API_BASE_URL}/rate-limit-stats`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },
};

export const UserApi = {
  /**
   * Get list of users
   * @returns A readable stream of the user list
   */
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-users`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const users = await response.json();

      return users.map((user: any) => {
        const tier = JSON.parse(user.tier);
        return new User(user.id, user.username, Tier.fromNumber(tier.limit));
      });
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get a single user
   * @param userId The ID of the user to get
   * @returns A readable stream of the user data
   */
  getUser: async (userId: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-account/${userId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Create a new user
   * @param user The user data to create
   * @returns A readable stream with the create response
   */
  createUser: async (user: User): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/create-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const apiKey = await response.text();

      setApiKeyCookie(apiKey);

      return apiKey;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default ChatApi;
