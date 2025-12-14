import { Suspense } from "react";
import { SidebarClient } from "./SidebarClient";
import Chats from "./Chats";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatService } from "@/services/chat.service";
import { currentUser } from "@clerk/nextjs/server";
import { UserService } from "@/services/user.service";

function ChatsSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}

async function getChats() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return [];

    const user = await UserService.getByClerkId(clerkUser.id);
    if (!user) return [];

    const chats = await ChatService.getAll(user.id);
    return chats || [];
  } catch (err) {
    console.log("ERROR getting chats", err);
    return [];
  }
}

export async function AppSidebar() {
  const chats = await getChats();

  return (
    <SidebarClient chats={chats}>
      <Suspense fallback={<ChatsSkeleton />}>
        <Chats />
      </Suspense>
    </SidebarClient>
  );
}
