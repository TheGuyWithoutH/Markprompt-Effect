export type Content =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "document_url";
      documentUrl: string;
    }
  | {
      type: "image_url";
      imageUrl: string;
    };

/**
 * Class representing a message.
 * A message is a collection of content with a role and a timestamp.
 */
class Message {
  readonly role: string;
  readonly content: Content[];
  readonly timestamp: Date;

  constructor(role: string, content: Content[]) {
    this.role = role;
    this.content = content;
    this.timestamp = new Date();
  }

  addFileContent(type: "document_url" | "image_url", url: string): Message {
    if (type === "document_url") {
      return new Message(this.role, [
        {
          type: "document_url",
          documentUrl: url,
        },
        ...this.content,
      ]);
    } else {
      return new Message(this.role, [
        {
          type: "image_url",
          imageUrl: url,
        },
        ...this.content,
      ]);
    }
  }

  updateTextContent(text: string): Message {
    const newTextContent = [...this.content].map((content) => {
      if (content.type === "text") {
        return { type: "text", text } as Content;
      } else {
        return content;
      }
    });

    return new Message(this.role, newTextContent);
  }

  clone(): Message {
    return new Message(this.role, [...this.content]);
  }
}

export default Message;
