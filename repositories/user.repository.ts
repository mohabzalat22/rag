import prisma from "@/prisma/prisma";
import type { User, CreateUser } from "@/types/user";

export const UserRepository = {
  create: (data: CreateUser): Promise<User> => prisma.user.create({ data }),

  getAll: (): Promise<User[]> => prisma.user.findMany(),

  getById: (id: number): Promise<User | null> =>
    prisma.user.findUnique({ where: { id } }),

  getByClerkId: (id: string): Promise<User | null> =>
    prisma.user.findUnique({ where: { clerkId: id } }),

  update: (id: number, data: Partial<User>) =>
    prisma.user.update({ where: { id }, data }),

  deleteById: (id: number) => prisma.user.delete({ where: { id } }),
};
