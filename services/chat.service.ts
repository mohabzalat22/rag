import asyncWrapper from "@/lib/utils/asyncWrapper";
import { ChatRespository } from "@/repositories/chat.repository";
import type { Chat, CreateChat } from "@/types/chat";

export const ChatService = {
  create: (data: CreateChat) =>
    asyncWrapper<Chat | null>(() => ChatRespository.create(data)),

  getAll: () => asyncWrapper<Chat[] | null>(() => ChatRespository.getAll()),

  getById: (id: number) =>
    asyncWrapper<Chat | null>(() => ChatRespository.getById(id)),

  getByToken: (token: string) =>
    asyncWrapper<Chat | null>(() => ChatRespository.getByToken(token)),

  update: (id: number, data: Partial<Chat>) =>
    asyncWrapper<Chat | null>(() => ChatRespository.update(id, data)),

  deleteById: (id: number) =>
    asyncWrapper(() => ChatRespository.deleteById(id)),

  deleteByToken: (token: string) =>
    asyncWrapper(() => ChatRespository.deleteByToken(token)),
};
