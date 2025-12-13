import { Actor } from "@/prisma/generated/enums";

export interface Message {
  id: number;
  chatId: number;
  actor: Actor;
  message: string;
}

export type CreateMessage = Omit<Message, "id">;
