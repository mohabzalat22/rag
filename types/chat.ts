import { Message } from "./message";

export interface Chat {
  id: number;
  title: string | null;
  token: string;
  userId: number;
}

export interface ChatWithMessages extends Chat {
  messages: Message[];
}

export type CreateChat = Omit<Chat, "id">;
