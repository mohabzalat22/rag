import { UserRepository } from "@/repositories/user.repository";
import type { User, CreateUser } from "@/types/user";
import asyncWrapper from "@/lib/utils/asyncWrapper";

export const UserService = {
  create: (data: CreateUser) =>
    asyncWrapper<User | null>(() => UserRepository.create(data)),
  getAll: () => asyncWrapper<User[] | null>(() => UserRepository.getAll()),
  getById: (id: number) =>
    asyncWrapper<User | null>(() => UserRepository.getById(id)),
  getByClerkId: (id: string) =>
    asyncWrapper<User | null>(() => UserRepository.getByClerkId(id)),
  update: (id: number, data: Partial<User>) =>
    asyncWrapper<User | null>(() => UserRepository.update(id, data)),
  deleteById: (id: number) => asyncWrapper(() => UserRepository.deleteById(id)),
};
