import ChatPage from "@/components/app/ChatPage";
import { syncUser } from "@/app/user/actions";

export default async function Page() {
  // Sync user on the server side
  await syncUser();

  return <ChatPage />;
}
