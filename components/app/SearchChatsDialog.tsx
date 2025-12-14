"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Chat {
  id: number;
  token: string;
  title: string | null;
}

interface SearchChatsDialogProps {
  chats: Chat[];
}

export function SearchChatsDialog({ chats }: SearchChatsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = useMemo(() => {
    if (searchQuery.trim() === "") {
      return [];
    }

    const query = searchQuery.toLowerCase();
    return chats.filter((chat) =>
      (chat.title || "Untitled Chat").toLowerCase().includes(query)
    );
  }, [searchQuery, chats]);

  const handleChatClick = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start px-2! font-normal"
        >
          <Search className="w-4 h-4" />
          <span>Search chats</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[600px]">
        <DialogHeader>
          <DialogTitle>Search Chats</DialogTitle>
          <DialogDescription>Search your chats by title</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Type to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {searchQuery.trim() === "" ? (
              <p className="text-center text-gray-500 py-8">
                Start typing to search chats
              </p>
            ) : filteredChats.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No chats found matching &quot;{searchQuery}&quot;
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  Found {filteredChats.length}{" "}
                  {filteredChats.length === 1 ? "chat" : "chats"}
                </p>
                {filteredChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.token}`}
                    onClick={handleChatClick}
                    className="block"
                  >
                    <div className="p-3 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer">
                      <p className="font-medium">
                        {chat.title || "Untitled Chat"}
                      </p>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
