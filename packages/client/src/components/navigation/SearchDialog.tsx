import React from "react";
import { DialogContent } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Search } from "lucide-react";
import { Separator } from "../ui/separator";
import Chat from "../../data/chat";
import Link from "next/link";

/**
 * Component representing the search dialog.
 * @param chats The list of chats to search
 */
function SearchDialog({ chats }: { chats: Partial<Chat>[] }) {
  const [searchResults, setSearchResults] = React.useState<Partial<Chat>[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (searchQuery.length > 1) {
      setSearchResults(
        chats.filter((chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, chats]);

  return (
    <DialogContent className="p-0 flex flex-col justify-start gap-0 [&>button]:hidden">
      <form className="w-full relative flex flex-row align-center m-0 px-2">
        <Search className="my-auto pb-1" size={20} color="gray" />
        <Textarea
          placeholder="Search..."
          className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0 text-base font-medium --font-inter"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex items-center p-3 pt-0 gap-3"></div>
      </form>
      <Separator className="m-0 p-0 w-full" />
      <div className="min-h-50 max-h-70 flex flex-col gap-2 p-2">
        {searchResults.map((chat) => (
          <Link
            href={`/chat/${chat.id}`}
            key={chat.id}
            className="p-2 hover:bg-primary/5 w-full rounded-lg"
          >
            {chat.name}
          </Link>
        ))}
      </div>
    </DialogContent>
  );
}

export default SearchDialog;
