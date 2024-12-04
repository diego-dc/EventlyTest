import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider>
      <SidebarLeft />
      <main className="flex-1">{children}</main>
      <SidebarRight />
    </SidebarProvider>
  );
}
