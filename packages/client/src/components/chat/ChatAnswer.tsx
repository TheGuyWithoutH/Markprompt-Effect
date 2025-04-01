"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Copy, Zap, ThumbsUp, ThumbsDown, Repeat } from "lucide-react";
import { Content } from "../../data/message";
import Markdown from "react-markdown";
import MistralLogo from "./MistralLogo";

/**
 * Component representing a chat assistant answer.
 * @param message The message to display
 * @param onRepeat The function to call when the re-generate button is clicked
 * @param timestamp The timestamp of the message
 */
function ChatAnswer({
  message,
  onRepeat,
  timestamp,
}: {
  message: Content[];
  onRepeat?: () => void;
  timestamp?: Date;
}) {
  const [hover, setHover] = useState(false);
  const [liked, setLiked] = useState<boolean | undefined>(undefined);
  const text = message
    .flatMap((content) => (content.type === "text" ? content.text : ""))
    .join("");

  return (
    <div
      className="w-full px-5 py-2.5 flex flex-row gap-3"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div>
        <MistralLogo size={28} />
      </div>
      <div className="answer relative flex-1 w-full">
        <div className="flex-1 w-full">
          <Markdown>{text}</Markdown>
        </div>
        <div
          className={`absolute -bottom-8 right-0 left-0 flex justify-start items-center gap-2 transition-opacity duration-200 ease-in-out ${
            hover ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-sm text-gray-400 text-right">
            {`${timestamp?.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
            })}, ${timestamp?.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}`}
          </p>
          <Zap className="size-4 mx-4" />
          <Button
            size="icon"
            variant="ghost"
            className="ml-auto cursor-pointer"
            onClick={() => setLiked(true)}
          >
            {liked ? <ThumbsUp fill="black" /> : <ThumbsUp />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="cursor-pointer"
            onClick={() => setLiked(false)}
          >
            {liked === false ? <ThumbsDown fill="black" /> : <ThumbsDown />}
          </Button>
          <Button size="icon" variant="ghost" className="cursor-pointer">
            <Repeat />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="cursor-pointer"
            onClick={() => navigator.clipboard.writeText(text)}
          >
            <Copy />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatAnswer;
