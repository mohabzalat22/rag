"use client";
import { Button } from "@/components/ui/button";
import { useChatInput } from "@/state/useChatInput";
import { ArrowUp, PlusCircle } from "lucide-react";
import { useRef, useEffect } from "react";

interface Props {
  className?: string;
}

export default function ChatInput(props: Props) {
  const { className } = props;
  const { input, setInput } = useChatInput();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const LINE_LIMIT = 65;

  // Check if input has newlines or exceeds character limit
  const isExpandedLayout = input.includes("\n") || input.length > LINE_LIMIT;

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    // Shift + Enter will naturally create a new line
  };

  const handleSubmit = () => {
    if (input.trim()) {
      // Trigger form submission
      const form = textareaRef.current?.closest("form");
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div
      className={`${
        isExpandedLayout ? "rounded-lg" : "rounded-full"
      } border max-h-[300px] overflow-hidden ${className}`}
    >
      <div
        className={`${
          isExpandedLayout ? "" : "flex items-center justify-between"
        } p-2`}
      >
        <Button
          className={`bg-black text-white w-10 h-10 rounded-full ${
            isExpandedLayout ? "hidden" : "block"
          } `}
        >
          <PlusCircle width={25} height={25} />
        </Button>

        <div className="ps-2 px-2 w-full">
          <textarea
            ref={textareaRef}
            name="message"
            value={input}
            className="w-full resize-none outline-0 items-center mt-1 max-h-[250px] overflow-y-auto"
            placeholder="Ask anything"
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            rows={1}
          />
        </div>

        <Button
          className={`bg-black text-white w-10 h-10 rounded-full ${
            isExpandedLayout ? "hidden" : "block"
          }`}
          onClick={handleSubmit}
        >
          <ArrowUp width={25} height={25} />
        </Button>
        {/* floor */}
        <div
          className={`flex justify-between ${
            isExpandedLayout ? "block" : "hidden"
          }`}
        >
          <Button className="bg-black text-white w-10 h-10 rounded-full">
            <PlusCircle width={25} height={25} />
          </Button>
          <Button
            type="submit"
            className="bg-black text-white w-10 h-10 rounded-full"
            onClick={handleSubmit}
          >
            <ArrowUp width={25} height={25} />
          </Button>
        </div>
      </div>
    </div>
  );
}
