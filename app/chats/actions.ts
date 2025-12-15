"use server";
import { ChatService } from "@/services/chat.service";
import { randomUUID } from "crypto";
import { currentUser } from "@clerk/nextjs/server";
import { UserService } from "@/services/user.service";
import { MessageService } from "@/services/message.service";
import { redirect } from "next/navigation";
import { Actor } from "@/prisma/generated/enums";
import { revalidatePath } from "next/cache";

export async function CreateChat(formData: FormData) {
  const formMessage = formData.get("message") as string;
  const token = randomUUID();
  const clerkUser = await currentUser();
  
  try {
    // validation
    if (!formMessage) throw Error("empty message");
    const title = formMessage.split(" ").slice(0, 3).join(" ");

    if (!clerkUser) throw Error("clerk user not found");
    const user = await UserService.getByClerkId(clerkUser.id);

    if (!user) throw Error("user not found");
    const userId = user.id;

    const chatData = { title, token, userId };

    const chat = await ChatService.create(chatData);
    if (!chat) throw Error("canont create anew chat");

    const chatId = chat.id;

    const messageData = { chatId, actor: Actor.USER, message: formMessage };

    const message = await MessageService.create(messageData);
    // insert first user message
    if (!message) throw Error("cannot insert first message");

    redirect(`/chat/${token}`);
  } catch (err) {
    // TODO : fix this fake redirect
    // Re-throw Next.js redirect errors (they're not actual errors)
    if (typeof err === "object" && err !== null && "digest" in err) {
      const digest = (err as { digest?: string }).digest;
      if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
        throw err;
      }
    }
    console.log("ERROR creating chat: ", err);
  }
}

export async function CreateMessage(
  prevState: { success: boolean } | null,
  formData: FormData
): Promise<{ success: boolean; error?: string; shouldStream?: boolean }> {
  const token = formData.get("token") as string;
  // we get only user message from the form
  const formMessage = formData.get("message") as string;
  try {
    // validation
    if (!token) throw Error("Error in chat id (token)");
    if (!formMessage) throw Error("empty message");

    const chat = await ChatService.getByToken(token);
    if (!chat) throw Error("chat not found");

    const messageData = {
      chatId: chat.id,
      actor: Actor.USER,
      message: formMessage,
    };
    const message = await MessageService.create(messageData);
    if (!message) throw Error("unable to create new message");
    await new Promise((resolve) => setTimeout(resolve, 100));
    revalidatePath(`/chat/${token}`);
    // Signal that streaming should start
    return { success: true, shouldStream: true };
  } catch (err) {
    console.log("ERROR creating chat: ", err);
    return { success: false, error: String(err) };
  }
}

export async function DeleteChat(chatId: number) {
  try {
    if (!chatId) throw Error("Error in chat id");

    await ChatService.deleteById(chatId);
    revalidatePath("/chat");

    return { success: true };
  } catch (err) {
    console.log("ERROR deleting chat: ", err);
    return { success: false, error: String(err) };
  }
}

export async function RenameChat(chatId: number, newTitle: string) {
  try {
    if (!chatId) throw Error("Error in chat id");
    if (!newTitle || newTitle.trim() === "")
      throw Error("Title cannot be empty");

    await ChatService.update(chatId, { title: newTitle.trim() });
    revalidatePath("/chat");

    return { success: true };
  } catch (err) {
    console.log("ERROR renaming chat: ", err);
    return { success: false, error: String(err) };
  }
}
