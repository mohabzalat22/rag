import prisma from "@/prisma/prisma";
import type { Message, CreateMessage } from "@/types/message";

export const MessageRespository = {
  create: (data: CreateMessage): Promise<Message> =>
    prisma.message.create({ data }),

  getAll: (chatId: number): Promise<Message[]> =>
    prisma.message.findMany({ where: { chatId: chatId } }),

  getById: (id: number): Promise<Message | null> =>
    prisma.message.findUnique({ where: { id } }),

  update: (id: number, data: Partial<Message>) =>
    prisma.message.update({ where: { id }, data }),

  deleteById: (id: number) => prisma.message.delete({ where: { id } }),
};
