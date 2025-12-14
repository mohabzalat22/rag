"use client";

import { CircleFadingPlus } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import { useSidebar } from "@/components/ui/sidebar";
import { useState } from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { SearchChatsDialog } from "./SearchChatsDialog";
import { ChevronDown } from "lucide-react";

interface Chat {
  id: number;
  token: string;
  title: string | null;
}

interface SidebarClientProps {
  children: React.ReactNode;
  chats: Chat[];
}

export function SidebarClient({ children, chats }: SidebarClientProps) {
  const { state } = useSidebar();
  const [isChatCollapsed, setIsChatCollapsed] = useState<boolean>(false);

  const toggleChat = () => {
    setIsChatCollapsed(!isChatCollapsed);
  };

  // Automatically collapse the chat list when sidebar is collapsed
  const isOpen = state === "collapsed" ? false : !isChatCollapsed;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div
          className={`flex justify-between ${
            state !== "collapsed" ? "p-2" : "p-1"
          }`}
        >
          {state !== "collapsed" && (
            <div>
              <p className="text-2xl text-gray-800">MORAG</p>
            </div>
          )}

          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* header */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/chat">
                    <CircleFadingPlus className="w-2 h-2" />
                    <span>New chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SearchChatsDialog chats={chats} />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* chats */}
        <SidebarGroup>
          <Collapsible
            open={isOpen}
            onOpenChange={toggleChat}
            className="group/collapsible"
          >
            <CollapsibleTrigger>
              <SidebarGroupLabel className="text-gray-500 text-base">
                Your chats
                <ChevronDown className="w-3 h-3" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="px-2">{children}</SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-1 border-t">
        <div
          className={`${
            state !== "collapsed"
              ? "bg-gray-200 hover:bg-gray-100 p-2 rounded-xl  flex items-center"
              : "px-1"
          }`}
        >
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
