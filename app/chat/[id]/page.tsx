import ChatMessages from "@/components/app/ChatMessages";
import { URL } from "@/lib/utils/constants";
import { Message } from "@/types/message";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // Fetch initial messages on the server
  const url = `${URL}/api/chats/${id}`;

  const response = await fetch(url, {
    cache: "no-store", // Ensure fresh data on each request
  });

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error("Unable to get chat messages");
  }

  const data = await response.json();
  const initialMessages: Message[] = data.data[0].messages;

  return <ChatMessages chatToken={id} initialMessages={initialMessages} />;
}
