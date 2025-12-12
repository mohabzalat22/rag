export interface User {
  id: number;
  clerkId: string;
  name: string;
  email: string;
}

export type CreateUser = Omit<User, "id">;
