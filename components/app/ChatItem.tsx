"use client";

import { Ellipsis, Trash, Pencil } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// TODO: make separate dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DeleteChat, RenameChat } from "@/app/chats/actions";
import { useRouter, usePathname } from "next/navigation";
import { useTransition, useState } from "react";

interface ChatItemProps {
  chat: {
    id: number;
    token: string;
    title: string | null;
  };
}

export function ChatItem({ chat }: ChatItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title || "");

  const handleDelete = () => {
    startTransition(async () => {
      const result = await DeleteChat(chat.id);
      if (result.success) {
        // Check if we're currently viewing the chat being deleted
        const isOnDeletedChat = pathname === `/chat/${chat.token}`;
        
        if (isOnDeletedChat) {
          // Redirect to home if we're deleting the current chat
          router.push("/chat");
        } else {
          // Just refresh the sidebar if we're on a different chat
          router.refresh();
        }
      } else {
        console.error("Failed to delete chat:", result.error);
      }
    });
  };

  const handleRename = () => {
    startTransition(async () => {
      const result = await RenameChat(chat.id, newTitle);
      if (result.success) {
        setIsRenameDialogOpen(false);
        router.refresh();
      } else {
        console.error("Failed to rename chat:", result.error);
      }
    });
  };

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild className="group/item">
          <div className="flex justify-between items-center w-full">
            <Link
              href={"/chat/" + chat.token}
              className="flex-1"
            >
              <span>{chat.title || "Untitled Chat"}</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  aria-label="Open menu" 
                  size="icon-sm"
                  onClick={(e) => e.preventDefault()} // Prevent link navigation
                >
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={() => setIsRenameDialogOpen(true)}
                  >
                    <Pencil className="me-1" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500!"
                    onSelect={handleDelete}
                    disabled={isPending}
                  >
                    <Trash className="text-red-500 me-1" />
                    {isPending ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>
              Enter a new title for this chat.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Chat title"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isPending) {
                handleRename();
              }
            }}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={isPending}>
              {isPending ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
