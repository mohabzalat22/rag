import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserService } from "@/services/user.service";
import { Success, Error } from "@/lib/utils/response";
//TODO: better error handling
function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  if (typeof err === "string") return err;
  return "Unknown error occurred";
}

export async function GET() {
  const clerkUser = await currentUser();

  if (!clerkUser)
    return NextResponse.json({ error: "sign in first" }, { status: 500 });

  try {
    const user = await UserService.getByClerkId(clerkUser.id);
    if (user) {
      return Success(true, 200, "hi", [user]);
    }
  } catch (err) {
    console.error("Error getting authenticated user:", err);
    return Error(false, 400, "Error getting authenticated user", [
      getErrorMessage(err),
    ]);
  }
}
