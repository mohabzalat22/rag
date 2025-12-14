import { Error, Success } from "@/lib/utils/response";
import { ChatService } from "@/services/chat.service";

import { NextRequest } from "next/server";
//TODO: better error handling
function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  if (typeof err === "string") return err;
  return "Unknown error occurred";
}

interface Params {
  params: Promise<{ token: string }>;
}
export async function GET(request: NextRequest, { params }: Params) {
  const { token } = await params;
  try {
    const chat = await ChatService.getByToken(token);
    if (chat) return Success(true, 200, "chat retrived", [chat]);
  } catch (err: unknown) {
    console.log("ERROR getting chat by token", err);
    return Error(true, 400, "Failed to retrieve chat", [getErrorMessage(err)]);
  }
}
