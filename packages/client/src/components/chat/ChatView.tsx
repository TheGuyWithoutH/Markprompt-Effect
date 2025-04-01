import React from "react";
import ChatInputMistral from "./ChatInput";
import MistralLogo from "./MistralLogo";
import ChatBubble from "./ChatBubble";
import ChatAnswer from "./ChatAnswer";
import Chat from "../../data/chat";
import Message from "../../data/message";

/**
 * Component representing the chat view.
 * @param chat The chat to display
 * @param sendMessage The function to call when a message is sent
 * @param loading Whether the chat is loading
 * @param incomingMessage The incoming message to display
 * @param messagesEndRef The reference to the messages end
 */
function ChatView({
  chat,
  sendMessage,
  loading,
  incomingMessage,
  messagesEndRef,
  deleteMessage,
}: {
  chat: Chat;
  sendMessage: (message: Message) => void;
  loading: boolean;
  incomingMessage?: Message;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  deleteMessage: (index: number) => void;
}) {
  if (!chat || chat.messages.length === 0) {
    return (
      <div className="flex flex-col gap-4 p-4 justify-center items-center">
        <MistralLogo size={125} className="m-4" />
        <ChatInputMistral sendMessage={sendMessage} />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-0 p-4 justify-center items-center w-full max-h-full overflow-hidden">
        <div
          className="flex flex-col gap-10 pb-2 pt-4 justify-start items-center w-full overflow-y-auto overflow-x-hidden box-content"
          style={{
            paddingRight: 17,
            marginRight: -17,
          }}
        >
          {chat.messages.map((chat, index) => {
            if (chat.role === "user") {
              return (
                <ChatBubble
                  key={index}
                  message={chat.content}
                  timestamp={new Date(chat.timestamp)}
                  onDelete={() => deleteMessage(index)}
                />
              );
            } else {
              return (
                <ChatAnswer
                  key={index}
                  message={chat.content}
                  timestamp={new Date(chat.timestamp)}
                />
              );
            }
          })}
          {incomingMessage && (
            <ChatAnswer
              message={incomingMessage.content}
              timestamp={new Date()}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-auto w-full">
          <ChatInputMistral sendMessage={sendMessage} />
        </div>
      </div>
    );
  }
}

export default ChatView;
