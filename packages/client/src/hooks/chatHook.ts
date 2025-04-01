import Chat from "../data/chat";
import { useEffect, useRef, useState } from "react";
import Message from "../data/message";
import { useChatContext } from "../components/navigation/historyProvider";
import index from "@guildplanner.pro/electron-next";
import { ChatApi } from "@/service/backend";

/**
 * Custom hook to manage the chat state
 * @param chatId The chat id to fetch from the backend
 * @returns The chat object, the function to send a message, the loading state, the incoming message and the reference to the messages end
 */
const useChat = (chatId?: string) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [incomingMessage, setIncomingMessage] = useState<Message | null>(null);
  const { addNewChat } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  useEffect(() => {
    // If a new chat was previously created and no messages were sent, delete the chat
    if (chat && chat.messages.length === 0) {
      // window.backend.deleteChat(chat.id);
    }

    // If the chatId is undefined, create a new chat
    if (chatId !== undefined) {
      // Fetch the chat from the server
      // window.backend
      //   .getChat(chatId)
      //   .then((chat: Chat) => {
      //     console.log("getting chat", chat);
      //     setInitialScrollDone(false);
      //     setChat(
      //       new Chat(chat.id, chat.name, chat.messages, chat.lastMessage)
      //     );
      //   })
      //   .catch(() => {
      //     console.log("Chat not found");
      //   });
    }

    return () => {
      // Cleanup the chat if no messages were sent
      if (chat && chat.messages.length === 0) {
        // window.backend.deleteChat(chat.id);
      }
    };
  }, [chatId]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (chat && chat.name === "New Chat" && loading === false) {
  //       console.log("Generating chat name", chat, loading);
  //       // generateChatName(
  //       //   chat.messages[0].content
  //       //     .filter((content) => content.type === "text")
  //       //     .map((content) => content.text)
  //       //     .join("")
  //       // ).then((name) => {
  //       //   addNewChat({ id: chat.id, name, lastMessage: chat.lastMessage });
  //       //   updateChat(new Chat(chat.id, name, chat.messages, chat.lastMessage));
  //       // });
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [chat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: initialScrollDone ? "smooth" : "auto",
    });

    console.log("Scrolling to bottom", initialScrollDone);

    if (!initialScrollDone) {
      setInitialScrollDone(true);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, incomingMessage]);

  const updateChat = (chat: Chat) => {
    setChat(chat);
    // Save the chat to the local storage
    // window.backend.setChat(chat);
  };

  const createChat = () => {
    const newChat = new Chat("new", "New Chat", [], new Date());
    addNewChat(newChat);
    updateChat(newChat);

    return newChat;
  };

  const sendMessage = async (message: Message) => {
    let newChat;
    setLoading(true);

    if (chat === null) {
      newChat = createChat();
    } else {
      newChat = chat.clone();
    }

    newChat.messages.push(message);
    updateChat(newChat);

    try {
      // Get the stream from the API
      const stream = await ChatApi.genChat(
        `${message.content[0].type === "text" ? message.content[0].text : ""}`
      );

      if (!stream) {
        throw new Error("No response stream received");
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let response = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        // Decode the chunk (Uint8Array) to text
        const chunk = decoder.decode(value, { stream: true });
        response += chunk;

        // Update the incoming message to show the stream in real-time
        setIncomingMessage(
          new Message("assistant", [{ type: "text", text: response }])
        );
      }

      // Make sure to decode any remaining bytes
      const finalChunk = decoder.decode();
      if (finalChunk) {
        response += finalChunk;
      }

      // After streaming is complete, update the chat with the final message
      setIncomingMessage(null);
      setLoading(false);

      updateChat(
        new Chat(
          newChat.id,
          newChat.name,
          [
            ...newChat.messages,
            new Message("assistant", [{ type: "text", text: response }]),
          ],
          new Date()
        )
      );
    } catch (error) {
      console.error("Error processing chat response:", error);
      setIncomingMessage(
        new Message("assistant", [
          {
            type: "text",
            text: error,
          },
        ])
      );
      setLoading(false);
    }
  };

  const deleteMessage = (index: number) => {
    if (chat === null) {
      return;
    }

    const newChat = chat.clone();
    newChat.messages.splice(index, 1);
    updateChat(newChat);
  };

  return [
    chat,
    sendMessage,
    loading,
    incomingMessage,
    messagesEndRef,
    deleteMessage,
  ] as const;
};

export { useChat };
