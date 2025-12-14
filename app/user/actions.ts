"use server";
import { currentUser } from "@clerk/nextjs/server";
import { UserService } from "@/services/user.service";

export async function syncUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const userExists = await UserService.getByClerkId(clerkUser.id);

    if (!userExists) {
      await UserService.create({
        clerkId: clerkUser.id,
        name: clerkUser.fullName || "",
        email: clerkUser.emailAddresses[0].emailAddress,
      });
    } else {
      await UserService.update(userExists.id, {
        clerkId: clerkUser.id,
        name: clerkUser.fullName || "",
        email: clerkUser.emailAddresses[0].emailAddress,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error syncing user to database:", error);
    return { success: false, error: "Unable to sync user" };
  }
}
