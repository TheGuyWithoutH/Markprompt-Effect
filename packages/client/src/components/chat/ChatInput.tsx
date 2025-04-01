"use client";

import { FileText, Image, Maximize2, Paperclip } from "lucide-react";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { ChatInput } from "../ui/chat/chat-input";
import SendIcon from "./SendIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Message, { Content } from "../../data/message";

/**
 * Component representing a chat input.
 * @param sendMessage The function to call when the send button is clicked
 */
function ChatInputMistral({
  sendMessage,
  onOpenFullScreen,
}: {
  sendMessage: (message: Message) => void;
  onOpenFullScreen?: () => void;
}) {
  const [message, setMessage] = React.useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [urlAttachments, setUrlAttachments] = useState<Content[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      // Filter only PDF and images files
      const validFiles = newFiles.filter(
        (file) =>
          file.type === "application/pdf" || file.type.startsWith("image/")
      );

      if (validFiles.length > 0) {
        setAttachments((prev) => [...prev, ...validFiles]);

        // Upload files
        const uploadPromises = validFiles.map(async (file) => {
          // const url = await uploadFile(file);
          // if (file.type === "application/pdf") {
          //   return { type: "document_url", documentUrl: url } as Content;
          // } else {
          //   return { type: "image_url", imageUrl: url } as Content;
          // }
        });

        Promise.all(uploadPromises).then((urls) => {
          // setUrlAttachments((prev) => [...prev, ...urls]);
        });
      }
    }
    // Reinitialize input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setUrlAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const sendingMessage = (message: string) => {
    const compiledMessage = {
      role: "user",
      content: [...urlAttachments, { type: "text", text: message } as Content],
      timestamp: new Date(),
    } as Message;

    setMessage("");
    sendMessage(compiledMessage);
  };

  return (
    <form
      className="w-full relative p-2 rounded-xl border-[0.5px] border-default bg-card transition-colors duration-300 ease-in-out shadow-md z-10"
      onSubmit={(e) => e.preventDefault()}
    >
      <ChatInput
        placeholder="Ask us anything on your issues"
        className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0 text-base font-medium --font-inter"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            // Si on appuie sur Enter sans Shift
            e.preventDefault();
            if (
              message.trim().length > 0 &&
              attachments.length === urlAttachments.length
            ) {
              sendingMessage(message);
            }
          }
        }}
      />
      <div className="flex items-center p-3 pt-0 gap-3">
        {/* Input hidden to select files */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf,image/*"
          multiple
          className="hidden"
          max="524288000" // limit to 512MB
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-accent cursor-pointer hover:bg-primary/10"
              onClick={handlePaperclipClick}
              disabled={attachments.length >= 5}
              type="button"
            >
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            sideOffset={5}
            className="bg-white p-2 rounded-lg color-primary text-black border-[0.5px] border-primary/10 shadow-sm"
          >
            <p>Drop PDFs or images here</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="bg-accent hover:bg-primary/10 px-2"
            >
              <span>Tools</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            sideOffset={5}
            className="bg-white p-2 rounded-lg color-primary text-black border-[0.5px] border-primary/10 shadow-sm"
          >
            <p>Coming soon...</p>
          </TooltipContent>
        </Tooltip>
        {onOpenFullScreen && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-accent cursor-pointer hover:bg-primary/10"
                onClick={onOpenFullScreen}
                disabled={attachments.length >= 5}
                type="button"
              >
                <Maximize2 className="size-4" />
                <span className="sr-only">Open Full Screen</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={5}
              className="bg-white p-2 rounded-lg color-primary text-black border-[0.5px] border-primary/10 shadow-sm"
            >
              <p>Open App</p>
            </TooltipContent>
          </Tooltip>
        )}

        {attachments.length > 0 && (
          <div
            className="flex gap-2 overflow-x-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {attachments.map((file, index) => (
              <div
                key={index}
                className={`flex flex-1 gap-1 items-center ${
                  urlAttachments.length > index ? "" : "opacity-50"
                }`}
              >
                {file.type === "application/pdf" ? (
                  <FileText className="w-4 h-4" />
                ) : (
                  <Image className="w-4 h-4" />
                )}
                <span className="text-sm flex-1 truncate">
                  {file.name.slice(0, 10) +
                    (file.name.length > 10 ? "..." : "")}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    removeAttachment(index);
                  }}
                >
                  <span className="sr-only">Remove attachment</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button
          size="sm"
          disabled={
            message.length === 0 || attachments.length !== urlAttachments.length
          }
          className="ml-auto gap-1.5 px-1"
          onClick={() => {
            sendingMessage(message);
          }}
        >
          <SendIcon />
        </Button>
      </div>
    </form>
  );
}

export default ChatInputMistral;
