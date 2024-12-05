import { SidebarLeft } from '@/components/sidebar-left';
import { SidebarRight } from '@/components/sidebar-right';
import { SidebarProvider } from '@/components/ui/sidebar';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <SidebarProvider>
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}
