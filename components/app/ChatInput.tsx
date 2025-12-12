"use client";
import { Button } from "@/components/ui/button";
import { useChatInput } from "@/state/useChatInput";
import { ArrowUp, PlusCircle } from "lucide-react";

interface Props {
  className?: string;
}

export default function ChatInput(props: Props) {
  const { className } = props;
  const { input, setInput } = useChatInput();
  const LINE_LIMIT = 65;
  return (
    <div
      className={`${
        input.length > LINE_LIMIT ? "rounded-lg" : "rounded-full"
      } border max-h-[300] overflow-hidden ${className}`}
    >
      <div
        className={`${
          input.length > LINE_LIMIT ? "" : "flex items-center justify-between"
        } p-2`}
      >
        <Button
          className={`bg-black text-white w-10 h-10 rounded-full ${
            input.length > LINE_LIMIT ? "hidden" : "block"
          } `}
        >
          <PlusCircle width={25} height={25} />
        </Button>

        <div className="ps-2 px-2 w-full">
          <textarea
            value={input}
            className="w-full resize-none outline-0 items-center mt-1"
            placeholder="Ask anything"
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </div>

        <Button
          className={`bg-black text-white w-10 h-10 rounded-full ${
            input.length > LINE_LIMIT ? "hidden" : "block"
          }`}
        >
          <ArrowUp width={25} height={25} />
        </Button>
        {/* floor */}
        <div
          className={`flex justify-between ${
            input.length > LINE_LIMIT ? "block" : "hidden"
          }`}
        >
          <Button className="bg-black text-white w-10 h-10 rounded-full">
            <PlusCircle width={25} height={25} />
          </Button>
          <Button className="bg-black text-white w-10 h-10 rounded-full">
            <ArrowUp width={25} height={25} />
          </Button>
        </div>
      </div>
    </div>
  );
}
