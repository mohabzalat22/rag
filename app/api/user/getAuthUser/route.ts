import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserService } from "@/services/user.service";
import { Success, Error } from "@/lib/utils/response";

export async function GET() {
  const clerkUser = await currentUser();

  if (!clerkUser)
    return NextResponse.json({ error: "sign in first" }, { status: 500 });

  try {
    const user = await UserService.getByClerkId(clerkUser.id);
    if (user) {
      return Success(true, 200, "hi", [user]);
    }
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return Error(false, 400, "Error getting authenticated user", [error]);
  }
}
