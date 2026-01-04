/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ChatInput from "@/components/app/ChatInput";
import { useRouter } from "next/navigation";
import { URL } from "@/lib/utils/constants";
import { useEffect, useState, useRef } from "react";
import { Message } from "@/types/message";
import Form from "next/form";
import { CreateMessage } from "@/app/chats/actions";
import { useActionState } from "react";
import { useChatInput } from "@/state/useChatInput";
import { Actor } from "@/prisma/generated/enums";
import ReactMarkdown from "react-markdown";

interface Props {
  chatToken: string;
  initialMessages: Message[];
}

export default function ChatMessagesClient({
  chatToken,
  initialMessages,
}: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [error, setError] = useState<string | null>(null);
  const { setInput } = useChatInput();
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [state, formAction] = useActionState(CreateMessage, null);

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (isStreaming && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [streamingMessage, isStreaming]);

  // start streaming for the first user message (only once)
  const hasStreamedRef = useRef(false);

  useEffect(() => {
    if (!hasStreamedRef.current) {
      hasStreamedRef.current = true;
      streamAIResponse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper functions
  const fetchChatMessages = async () => {
    try {
      const url = `${URL}/api/chats/${chatToken}`;
      const response = await fetch(url);

      if (!response.ok) {
        // If chat is not found (404), redirect to home
        if (response.status === 404) {
          router.push("/chat");
          return;
        }
        setError("Unable to get chat messages");
        return;
      }

      const data = await response.json();
      setMessages(data.data[0].messages);
    } catch (err) {
      setError("Failed to load chat");
      console.error(err);
    }
  };

  // Handle optimistic message addition
  const handleFormSubmit =  (formData: FormData) => {
    const userMessage = formData.get("message") as string;

    if (!userMessage?.trim()) return;

    // Optimistically add user message immediately
    const optimisticMessage: Message = {
      id: -Date.now(), // temporary ID
      chatId: 0, // temporary
      actor: Actor.USER,
      message: userMessage,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    // Clear input immediately
    setInput("");

    // Submit form action
    formAction(formData);

    // Start streaming AI response
    streamAIResponse();
  };

  // Function to handle streaming AI response
  const streamAIResponse = async () => {
    setIsStreaming(true);
    setStreamingMessage("");

    try {
      const response = await fetch(`${URL}/api/chats/${chatToken}/respond`);

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let fullMessage = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6); // Remove "data: " prefix

            if (data === "[DONE]") {
              console.log("DONE")
              // Stream is complete
              setIsStreaming(false);

              // Save the complete message to database
              await fetch(`${URL}/api/chats/${chatToken}/respond`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: fullMessage }),
              });

              // Refresh messages to get the saved message with proper ID
              await fetchChatMessages();
              setStreamingMessage("");
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullMessage += parsed.content;
                setStreamingMessage((prev) => prev + parsed.content);
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error streaming AI response:", error);
      setError("Failed to get AI response");
      setIsStreaming(false);
      setStreamingMessage("");
    }
  };

  useEffect(() => {
    if (state?.success) {
      // Refresh messages from server to get the actual IDs and any AI response
      fetchChatMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (error) return <div>{error}</div>;

  return (
    <div className="">
      {/* preview chat */}
      <div className="z-20 mb-[100px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.actor === "USER" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="text-gray-800 bg-gray-100 rounded-xl p-4 my-5 max-w-3xl prose prose-sm">
              <ReactMarkdown>{message.message}</ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Streaming message it will be removed after complete response*/}
        {streamingMessage && (
          <div className="flex justify-start">
            <div className="text-gray-800 bg-gray-100 rounded-xl p-4 my-5 max-w-3xl prose prose-sm">
              <ReactMarkdown>{streamingMessage}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      <Form
        action={handleFormSubmit}
        className="sticky bottom-0 py-5 bg-white z-50 "
      >
        <input type="text" name="token" defaultValue={chatToken} hidden />
        <ChatInput />
      </Form>
    </div>
  );
}
