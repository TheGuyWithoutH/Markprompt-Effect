"use client";

import {
  Archive,
  Check,
  ChevronDown,
  CircleArrowUp,
  LogOut,
  MessageSquarePlus,
  Moon,
  Search,
  Sun,
  Trash2,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DialogTrigger } from "../ui/dialog";
import Chat from "../../data/chat";
import { Button } from "../ui/button";
import { useState } from "react";
import Link from "next/link";

/**
 * Component representing the application sidebar.
 * @param onSearch The function to call when the search button is clicked
 * @param conversations The list of conversations to display
 * @param theme The current theme
 * @param flash Whether flash answers are enabled
 * @param username The username to display
 * @param deleteChat The function to call when a chat is deleted
 * @param clearChats The function to call when all chats are cleared
 * @param currentChatId The current chat ID
 */
export function AppSidebar({
  onSearch,
  conversations,
  theme,
  flash,
  username = "TheGuyWithoutH",
  deleteChat,
  clearChats,
  currentChatId,
}: {
  onSearch: () => void;
  conversations: Partial<Chat>[];
  theme: "light" | "dark" | "system";
  flash: boolean;
  username?: string;
  deleteChat: (chatId: string) => void;
  clearChats: () => void;
  currentChatId: string | undefined;
}) {
  return (
    <Sidebar>
      <SidebarHeader className="pt-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center py-6">
                  <Avatar>
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback className="rounded-lg">UB</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col font-semibold text-sm">
                    <span>{username}</span>
                    <p className="text-xs text-gray-500 font-light">
                      Markprompt Free
                    </p>
                  </div>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    {theme === "light" ? <Sun /> : <Moon />}
                    <span>Toggle Theme</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Zap />
                    <span>Enable Flash Answers</span>
                    {flash ?? true ? (
                      <Check className="ml-auto" />
                    ) : (
                      <div className="w-[24px]" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Archive />
                    <span>Archived Chats</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={clearChats}>
                    <Trash2 />
                    <span>Clear All Chats</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => window.backend.quitApp()}>
                    <LogOut />
                    <span>Quit</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`${
                    currentChatId === undefined ||
                    currentChatId === "chat" ||
                    currentChatId === "new"
                      ? "bg-primary/5 cursor-pointer"
                      : "cursor-pointer"
                  }`}
                >
                  <Link href="/chat">
                    <MessageSquarePlus />
                    <span>New Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <DialogTrigger className="w-full">
                  <SidebarMenuButton
                    asChild
                    onClick={onSearch}
                    className="cursor-pointer"
                  >
                    <span>
                      <Search />
                      <span>Search</span>
                    </span>
                  </SidebarMenuButton>
                </DialogTrigger>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="text-white hover:text-white bg-black hover:bg-gray-800 cursor-pointer"
                >
                  <a href="https://chat.mistral.ai/upgrade" target="_blank">
                    <CircleArrowUp />
                    <span>
                      Upgrade to Markprompt <b>Pro</b>
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((item) => (
                <ConversationItem
                  key={item.id}
                  item={item}
                  currentChatId={currentChatId}
                  deleteChat={deleteChat}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function ConversationItem({ item, currentChatId, deleteChat }) {
  const [hover, setHover] = useState(false);

  return (
    <SidebarMenuItem key={item.id}>
      <SidebarMenuButton
        asChild
        className={`${item.id === currentChatId ? "bg-primary/10" : ""}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Link href={`/chat/${item.id}`}>
          <span>{item.name}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteChat(item.id);
            }}
            className={`ml-auto cursor-pointer ${
              hover ? "opacity-100" : "opacity-0"
            } hover:bg-primary/5`}
          >
            <Trash2 />
          </Button>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
