"use client";

import React, { createContext, useContext } from "react";
import Chat from "../../data/chat";

interface ChatContextProps {
  addNewChat: (chat: Partial<Chat>) => void;
}

/**
 * Context for the chat, used to add a new chat in the sidebar
 */
const ChatContext = createContext<ChatContextProps | undefined>(undefined);

/**
 * Provider for the chat context
 * @param children The children to render
 * @param addNewChat The function to call when a new chat is added
 */
export function ChatProvider({
  children,
  addNewChat,
}: ChatContextProps & { children: React.ReactNode }) {
  return (
    <ChatContext.Provider value={{ addNewChat }}>
      {children}
    </ChatContext.Provider>
  );
}

/**
 * Hook to use the chat context
 * @returns The chat context
 */
export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
