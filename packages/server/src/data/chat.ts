import Message from "./message";

/**
 * Class representing a chat.
 */
class Chat {
  readonly id: string;
  readonly name: string;
  readonly messages: Message[];
  readonly lastMessage: Date;
  readonly archived: boolean = false;

  constructor(
    id: string,
    name: string,
    messages: Message[],
    lastMessage: Date,
    archived: boolean = false
  ) {
    this.id = id;
    this.name = name;
    this.messages = messages;
    this.lastMessage = lastMessage;
    this.archived = archived;
  }

  clone(): Chat {
    return new Chat(
      this.id,
      this.name,
      [...this.messages],
      this.lastMessage,
      this.archived
    );
  }
}

export default Chat;
