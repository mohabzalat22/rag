import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import Header from "@/components/app/Header";
import { SignedIn } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SignedIn>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <Header />
          <div className="flex justify-center items-center h-full">
            <div className="w-[700]">{children}</div>
          </div>
        </main>
      </SidebarProvider>
    </SignedIn>
  );
}
