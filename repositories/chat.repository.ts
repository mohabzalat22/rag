import prisma from "@/prisma/prisma";
import type { Chat, CreateChat } from "@/types/chat";

export const ChatRespository = {
  create: (data: CreateChat): Promise<Chat> => prisma.chat.create({ data }),

  getAll: (): Promise<Chat[]> => prisma.chat.findMany(),

  getById: (id: number): Promise<Chat | null> =>
    prisma.chat.findUnique({ where: { id } }),

  getByToken: (token: string): Promise<Chat | null> =>
    prisma.chat.findUnique({ where: { token } }),

  update: (id: number, data: Partial<Chat>) =>
    prisma.chat.update({ where: { id }, data }),

  deleteById: (id: number) => prisma.chat.delete({ where: { id } }),

  deleteByToken: (token: string) =>
    prisma.chat.delete({ where: { token: token } }),
};
