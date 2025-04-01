import { Mistral } from "@mistralai/mistralai";
import Chat from "src/data/chat.js";
import { z } from "zod";
import { Effect } from "effect";

// Define types for better type safety
type MistralConfig = {
  apiKey: string;
};

type ChatResponseChunk = string;
type ChatName = string;
type SignedUrl = string;

/**
 * Mistral API client service layer using Effect
 */
export class MistralService {
  // Create Effect context for the Mistral client
  static readonly Tag = Effect.tag<MistralService>();

  private mistral: Mistral;

  constructor(config: MistralConfig) {
    this.mistral = new Mistral(config);
  }

  /**
   * Send chat messages to Mistral API
   */
  sendChatMessages(chat: Chat) {
    return Effect.tryPromise({
      try: () =>
        this.mistral.chat.stream({
          model: "mistral-small-latest",
          messages: chat.messages,
          safePrompt: true,
        }),
      catch: (error) => new Error(`Failed to send chat messages: ${error}`),
    });
  }

  /**
   * Generate a chat name for a given message
   */
  generateChatName(message: string) {
    return Effect.tryPromise({
      try: async () => {
        const response = await this.mistral.chat.parse({
          model: "ministral-8b-latest",
          messages: [
            {
              role: "system",
              content: "Define a name for this chat.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          responseFormat: z.object({
            name: z.string(),
          }),
          maxTokens: 250,
          temperature: 0,
        });

        // @ts-ignore
        return response.choices[0].message.parsed.name;
      },
      catch: (error) => new Error(`Failed to generate chat name: ${error}`),
    });
  }

  /**
   * Upload a file to Mistral API
   */
  uploadFile(file: File) {
    return Effect.tryPromise({
      try: async () => {
        const uploaded_file = await this.mistral.files.upload({
          file: file,
          purpose: "ocr",
        });

        const signedUrl = await this.mistral.files.getSignedUrl({
          fileId: uploaded_file.id,
        });

        return signedUrl.url;
      },
      catch: (error) => new Error(`Failed to upload file: ${error}`),
    });
  }
}

/**
 * Create a live Mistral service
 */
export const createLiveMistralService = Effect.sync(() => {
  const apiKey = process.env.MISTRAL_API_KEY ?? "";
  return new MistralService({ apiKey });
});

/**
 * Mock Mistral service for testing
 */
export class MockMistralService implements MistralService {
  sendChatMessages(chat: Chat) {
    return Effect.gen(function* (_) {
      console.log("Mocking chat messages");

      const mockGenerator = async function* () {
        yield "Hello";
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield "How can I help you?";
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield "I am a mock response";
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield "I am a mock response";
      };

      return mockGenerator();
    });
  }

  generateChatName(message: string) {
    return Effect.succeed(`Mock chat name for: ${message.substring(0, 20)}...`);
  }

  uploadFile(file: File) {
    return Effect.succeed("https://mock-signed-url.com/file");
  }
}

/**
 * Create a mock Mistral service
 */
export const createMockMistralService = Effect.sync(
  () => new MockMistralService()
);

/**
 * Usage examples (these would be in your application code)
 */

// Example: Send chat messages
export const sendChatMessagesEffect = (chat: Chat) =>
  Effect.flatMap(MistralService.Tag, (service) =>
    service.sendChatMessages(chat)
  );

// Example: Generate a chat name
export const generateChatNameEffect = (message: string) =>
  Effect.flatMap(MistralService.Tag, (service) =>
    service.generateChatName(message)
  );

// Example: Upload a file
export const uploadFileEffect = (file: File) =>
  Effect.flatMap(MistralService.Tag, (service) => service.uploadFile(file));

// Example: Provide the live implementation
export const withLiveMistralService = <R, E, A>(
  effect: Effect.Effect<A, E, R | MistralService>
) =>
  Effect.provideServiceEffect(
    effect,
    MistralService.Tag,
    createLiveMistralService
  );
