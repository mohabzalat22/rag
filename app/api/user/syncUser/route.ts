import { currentUser, auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserService } from "@/services/user.service";

export async function POST() {
  const { userId } = await auth();
  const clerkUser = await currentUser();
  // check if user exists in the database otherwise create one
  if (!userId || !clerkUser)
    return NextResponse.json({ error: "sign in first" }, { status: 500 });

  try {
    const userExists = await UserService.getByClerkId(userId);
    if (!userExists) {
      await UserService.create({
        clerkId: userId,
        name: clerkUser.fullName || "",
        email: clerkUser.emailAddresses[0].emailAddress,
      });
    } else {
      await UserService.update(userExists.id, {
        clerkId: userId,
        name: clerkUser.fullName || "",
        email: clerkUser.emailAddresses[0].emailAddress,
      });
    }
  } catch (error) {
    console.error("Error syncing user to database:", error);
    return NextResponse.json({ error: "Unable to sync user" }, { status: 500 });
  }

  return NextResponse.json({ error: "Success sync user" }, { status: 201 });
}
