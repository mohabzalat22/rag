"use client";
import ChatInput from "@/components/app/ChatInput";
import Form from "next/form";
import { CreateChat } from "@/app/chats/actions";
import { useChatInput } from "@/state/useChatInput";

export default function ChatPage() {
  const { setInput } = useChatInput();

  const handleFormSubmit = async (formData: FormData) => {
    const message = formData.get("message") as string;

    if (!message?.trim()) return;

    // Clear input immediately
    setInput("");

    // Submit the form
    await CreateChat(formData);
  };

  return (
    <div>
      {/* header */}
      <h1 className="text-3xl text-center px-2 py-6">Ready when you are.</h1>
      {/* chat input */}
      <Form action={handleFormSubmit}>
        <ChatInput />
      </Form>
    </div>
  );
}
