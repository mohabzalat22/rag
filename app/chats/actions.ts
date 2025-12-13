"use server";
import { ChatService } from "@/services/chat.service";
import { randomUUID } from "crypto";
import { currentUser } from "@clerk/nextjs/server";
import { UserService } from "@/services/user.service";
import { MessageService } from "@/services/message.service";
import { redirect } from "next/navigation";
import { Actor } from "@/prisma/generated/enums";

export async function CreateChat(formData: FormData) {
  const title = "title";
  const token = randomUUID();
  const clerkUser = await currentUser();
  const formMessage = formData.get("message") as string;

  try {
    // validation
    if (!formMessage) throw Error("empty message");

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
    console.log("ERROR creating chat: ", err);
  }
}
