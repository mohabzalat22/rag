export interface Chat {
  id: number;
  title: string | null;
  token: string;
  userId: number;
}

export type CreateChat = Omit<Chat, "id">;
