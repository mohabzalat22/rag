"use client";
import ChatInput from "@/components/app/ChatInput";
import Form from "next/form";
import { CreateChat } from "@/app/chats/actions";

export default function ChatPage() {
  return (
    <div>
      {/* header */}
      <h1 className="text-3xl text-center px-2 py-6">Ready when you are.</h1>
      {/* chat input */}
      <Form action={CreateChat}>
        <ChatInput />
      </Form>
    </div>
  );
}
