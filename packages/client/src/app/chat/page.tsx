"use client";

import ChatView from "../../components/chat/ChatView";
import { useChat } from "../../hooks/chatHook";

/**
 * Component representing the new chat page.
 */
export default function Chat() {
  const [
    chat,
    sendMessage,
    loading,
    incomingMessage,
    messagesEndRef,
    deleteMessage,
  ] = useChat();
  return (
    <>
      <ChatView
        loading={loading}
        chat={chat}
        incomingMessage={incomingMessage}
        sendMessage={sendMessage}
        messagesEndRef={messagesEndRef}
        deleteMessage={deleteMessage}
      />
    </>
  );
}
