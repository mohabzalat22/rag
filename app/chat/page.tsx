"use client";
import ChatInput from "@/components/app/ChatInput";
import asyncWrapper from "@/lib/utils/asyncWrapper";
import { URL } from "@/lib/utils/constants";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import Form from "next/form";
import { CreateChat } from "../chats/actions";

export default function Page() {
  const { isSignedIn } = useAuth();

  // sync user
  const url = `${URL}/api/user/syncUser`;

  useEffect(() => {
    if (isSignedIn) {
      fetch(url, {
        method: "POST", // Use POST method
      })
        .then((res) => res.json())
        .then((data) => console.log("User synced:", data))
        .catch((err) => console.error("Sync failed:", err));
    }
  });

  asyncWrapper(() => fetch(url));
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
