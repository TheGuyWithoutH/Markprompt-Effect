import { useEffect, useState } from "react";
import Chat from "../data/chat";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

type ChatOverview = Partial<Chat>;

/**
 * Custom hook to manage the chat history state
 * @returns The list of chats, the current chat ID, the function to add a new chat, the function to delete a chat and the function to clear all chats
 */
const useHistory = () => {
  const [chats, setChats] = useState<ChatOverview[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    updateChatList();

    // Extraire l'ID du chat actuel de l'URL
    // Si l'URL est du type /chat/[id], cela récupère l'ID
    setCurrentChatId(pathname.split("/").pop());
  }, [pathname]);

  useEffect(() => {
    console.log("Current chat ID", currentChatId);
    setShowSearch(false);
  }, [currentChatId]);

  const addNewChat = (chat: ChatOverview) => {
    setChats((prevChats) => [
      chat,
      ...prevChats.filter((c) => c.id !== chat.id),
    ]);
    setCurrentChatId(chat.id);
  };

  const updateChatList = () => {
    // window.backend.getChats().then((chats: { [s: string]: Chat }) => {
    //   setChats(
    //     Object.values(chats)
    //       .sort((a, b) => {
    //         return (
    //           new Date(b.lastMessage).getTime() -
    //           new Date(a.lastMessage).getTime()
    //         );
    //       })
    //       .map((chat) => {
    //         return {
    //           id: chat.id,
    //           name: chat.name,
    //         };
    //       })
    //   );
    // });
  };

  const deleteChat = (chatId: string) => {
    // window.backend.deleteChat(chatId).then(() => {
    //   setChats((prevChats) => prevChats.filter((c) => c.id !== chatId));
    //   if (currentChatId === chatId) {
    //     router.push("/chat");
    //   }
    // });
  };

  const clearChats = () => {
    // window.backend.clearChats().then(() => {
    //   setChats([]);
    // });
  };

  return [
    chats,
    currentChatId,
    addNewChat,
    deleteChat,
    clearChats,
    showSearch,
    setShowSearch,
  ] as const;
};

export { useHistory };
