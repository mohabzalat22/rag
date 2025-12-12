"use client";
import { useChatInput } from "@/state/useChatInput";
import ChatInput from "@/components/app/ChatInput";

export default function Page() {
  const { input } = useChatInput();
  return (
    <div className="">
      {/* preview chat */}
      <div className="z-20">
        <div className="flex justify-end">
          <p className="text-gray-800 bg-gray-100 rounded-xl p-2 my-5 max-w-120 break-words">
            {input}
          </p>
        </div>
        <div className="flex justify-start">
          <p className="text-gray-800 bg-gray-100 rounded-xl p-2 my-5 max-w-120 break-words">
            {input}
          </p>
        </div>
      </div>

      <ChatInput className="sticky bottom-10 bg-white z-50" />
    </div>
  );
}
