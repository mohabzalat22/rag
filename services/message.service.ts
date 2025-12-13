import asyncWrapper from "@/lib/utils/asyncWrapper";
import { MessageRespository } from "@/repositories/message.repository";
import type { Message, CreateMessage } from "@/types/message";

export const MessageService = {
  create: (data: CreateMessage) =>
    asyncWrapper<Message | null>(() => MessageRespository.create(data)),

  getAll: () =>
    asyncWrapper<Message[] | null>(() => MessageRespository.getAll()),

  getById: (id: number) =>
    asyncWrapper<Message | null>(() => MessageRespository.getById(id)),

  update: (id: number, data: Partial<Message>) =>
    asyncWrapper<Message | null>(() => MessageRespository.update(id, data)),

  deleteById: (id: number) =>
    asyncWrapper(() => MessageRespository.deleteById(id)),
};
