"use client";
import { CircleFadingPlus, Search, Ellipsis, ChevronDown } from "lucide-react";
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
import { useState, useEffect } from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
const items = [
  {
    title: "New chat",
    url: "/new",
    icon: CircleFadingPlus,
  },
  {
    title: "Search chats",
    url: "/chats",
    icon: Search,
  },
];

const chats = [
  {
    title: "my chat 1",
    url: "/chat/token",
  },
  {
    title: "my chat 2",
    url: "/chat/token",
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const [isChatCollapsed, setIsChatCollapsed] = useState<boolean>(
    state == "collapsed"
  );

  const toggleChat = () => {
    setIsChatCollapsed(!isChatCollapsed);
  };

  useEffect(() => {
    if (state == "collapsed") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsChatCollapsed(true);
    } else {
      setIsChatCollapsed(false);
    }
  }, [state]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div
          className={`flex justify-between ${
            !(state == "collapsed") ? "p-2" : "p-1"
          }`}
        >
          {!(state == "collapsed") && (
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="w-2 h-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* chats */}
        <SidebarGroup>
          <Collapsible
            open={!isChatCollapsed}
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
                <SidebarMenu className="px-2">
                  {chats.map((chat) => (
                    <SidebarMenuItem key={chat.title}>
                      <SidebarMenuButton asChild className="group/item">
                        <Link
                          href={chat.url}
                          className="flex justify-between items-center"
                        >
                          <span>{chat.title}</span>
                          <Ellipsis className="invisible group-hover/item:visible" />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-10  px-1 border-t">
        <div
          className={`${
            !(state == "collapsed")
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
