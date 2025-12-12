import { create } from "zustand";

type ChatInput = {
  input: string;
  setInput: (newInput: string) => void;
};

export const useChatInput = create<ChatInput>((set) => ({
  input: "",
  setInput: (newInput: string) => set({ input: newInput }),
}));
