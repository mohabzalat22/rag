import ChatMessages from "@/components/app/ChatMessages";
import { ChatService } from "@/services/chat.service";
import { ChatWithMessages } from "@/types/chat";
import { Message } from "@/types/message";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // Fetch chat directly from database instead of HTTP request
  const chat = (await ChatService.getByToken(id)) as ChatWithMessages | null;

  if (!chat) {
    console.error(`Chat not found for token: ${id}`);
    notFound();
  }

  const initialMessages: Message[] = chat.messages || [];

  return <ChatMessages chatToken={id} initialMessages={initialMessages} />;
}
