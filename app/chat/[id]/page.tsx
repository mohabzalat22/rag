"use client";
import ChatInput from "@/components/app/ChatInput";
import { useParams } from "next/navigation";
import { URL } from "@/lib/utils/constants";
import { useEffect, useState } from "react";
import { Message } from "@/types/message";
import Form from "next/form";
import { CreateMessage } from "@/app/chats/actions";
import { useActionState } from "react";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [state, formAction] = useActionState(CreateMessage, null);

  // helper functions
  const fetchChatMessages = async () => {
    try {
      const url = `${URL}/api/chats/${id}`;
      const response = await fetch(url);

      if (!response.ok) {
        setError("Unable to get chat messages");
        return;
      }

      const data = await response.json();
      setMessages(data.data[0].messages);
    } catch (err) {
      setError("Failed to load chat");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchChatMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (state?.success) {
      fetchChatMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="">
      {/* preview chat */}
      {/* TODO: mb + scroll to button */}
      <div className="z-20 mb-[100px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.actor === "USER" ? "justify-end" : "justify-start"
            }`}
          >
            <p className="text-gray-800 bg-gray-100 rounded-xl p-2 my-5 max-w-120 wrap-break-word">
              {message.message}
            </p>
          </div>
        ))}
      </div>
      <Form action={formAction} className="sticky bottom-0 py-5 bg-white z-50 ">
        <input type="text" name="token" defaultValue={id} hidden />
        <ChatInput />
      </Form>
    </div>
  );
}
