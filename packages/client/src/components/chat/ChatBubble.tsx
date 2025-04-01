"use client";

import { Copy, Edit, FileText, Trash } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Content } from "../../data/message";

/**
 * Component representing a chat user bubble.
 * @param message The message to display
 * @param onEdit The function to call when the edit button is clicked
 * @param timestamp The timestamp of the message
 */
function ChatBubble({
  message,
  onDelete,
  timestamp,
}: {
  message: Content[];
  onDelete?: () => void;
  timestamp?: Date;
}) {
  const [hover, setHover] = React.useState(false);
  const text = message
    .flatMap((content) => (content.type === "text" ? content.text : ""))
    .join("");
  const files = message.filter(
    (content) => content.type === "image_url" || content.type === "document_url"
  );

  return (
    <div
      className="relative max-w-full  ml-auto bg-primary/5 px-5 py-2.5 rounded-3xl"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {text}
      {files && files.length > 0 && (
        <div className="flex justify-end gap-2 mt-2">
          {files.map((content, index) => {
            if (content.type === "image_url") {
              return (
                <a
                  key={index}
                  href={content.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer"
                >
                  <img
                    key={index}
                    src={content.imageUrl}
                    className="w-10 h-10 object-cover rounded-lg border"
                    alt="image message"
                  />
                </a>
              );
            } else {
              return (
                <a
                  key={index}
                  href={content.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-400 hover:text-orange-600 hover:bg-orange-100 cursor-pointer"
                >
                  <FileText />
                </a>
              );
            }
          })}
        </div>
      )}
      <div
        className={`absolute -bottom-10 right-0 flex justify-end items-center gap-2 transition-opacity duration-200 ease-in-out ${
          hover ? "opacity-100" : "opacity-0"
        } w-100`}
      >
        <Button size="icon" variant="ghost">
          <Edit />
        </Button>
        <Button size="icon" variant="ghost" onClick={onDelete}>
          <Trash />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => navigator.clipboard.writeText(text)}
        >
          <Copy />
        </Button>
        <p className="text-sm text-gray-400 text-right">
          {/* display date with the following format: 15 March, 17:35 */}
          {`${timestamp?.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
          })}, ${timestamp?.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        </p>
      </div>
    </div>
  );
}

export default ChatBubble;
