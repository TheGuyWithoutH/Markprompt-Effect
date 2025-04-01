"use client";

import { useEffect, useState } from "react";
import ChatView from "../../../components/chat/ChatView";
import { useChat } from "../../../hooks/chatHook";

/**
 * Component representing a chat page for an existing chat.
 * @param params The parameters for the chat page, containing the chat ID
 */
export default function Chat({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [
    chat,
    sendMessage,
    loading,
    incomingMessage,
    messagesEndRef,
    deleteMessage,
  ] = useChat(chatId);

  useEffect(() => {
    params.then(({ chatId }) => {
      setChatId(chatId);
    });
  }, []);

  return (
    <ChatView
      loading={loading}
      chat={chat}
      incomingMessage={incomingMessage}
      sendMessage={sendMessage}
      messagesEndRef={messagesEndRef}
      deleteMessage={deleteMessage}
    />
  );
}
