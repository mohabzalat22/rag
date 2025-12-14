import { ChatService } from "@/services/chat.service";
import { currentUser } from "@clerk/nextjs/server";
import { UserService } from "@/services/user.service";
import { ChatItem } from "./ChatItem";

export default async function Chats() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) throw Error("clerk user not found");

    const user = await UserService.getByClerkId(clerkUser.id);
    if (!user) throw Error("user not found");

    const chats = await ChatService.getAll(user.id);
    if (!chats) throw Error("user not found");

    return chats.map((chat) => <ChatItem key={chat.id} chat={chat} />);
  } catch (err) {
    console.log("ERROR getting chats", err);
    return null;
  }
}
