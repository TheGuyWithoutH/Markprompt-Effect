"use client";

import { AppSidebar } from "../../components/navigation/AppSidebar";
import { ChatProvider } from "../../components/navigation/historyProvider";
import SearchDialog from "../../components/navigation/SearchDialog";
import { Dialog } from "../../components/ui/dialog";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { TooltipProvider } from "../../components/ui/tooltip";
import { useHistory } from "../../hooks/historyHook";

/**
 * Component representing the default layout for a chat page.
 * @param children The children to render
 */
export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [
    chats,
    currentChatId,
    addNewChat,
    deleteChat,
    clearChats,
    showSearch,
    setShowSearch,
  ] = useHistory();

  return (
    <SidebarProvider>
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <AppSidebar
          onSearch={() => {}}
          conversations={chats}
          theme={"light"}
          flash={false}
          deleteChat={deleteChat}
          clearChats={clearChats}
          currentChatId={currentChatId}
        />
        <main className="relative p-2 w-auto flex justify-center flex-1 bg-sidebar max-h-screen">
          <div className="mt-4 ml-4 grid absolute top-0 left-0 z-10">
            <SidebarTrigger />
          </div>
          <SearchDialog chats={chats} />
          <div className="w-full grid min-mx-8 mx-auto px-4 max-w-[800px] max-h-full">
            <TooltipProvider>
              <ChatProvider addNewChat={addNewChat}>{children}</ChatProvider>
            </TooltipProvider>
          </div>
        </main>
      </Dialog>
    </SidebarProvider>
  );
}
