'use client';

import * as React from 'react';
import { GalleryVerticalEnd } from 'lucide-react';
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  CalendarPlus2,
  WalletCards,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';
import { NavUser } from './nav-user';

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  console.log(session);

  // This is sample data.
  const data2 = {
    navMain: [
      {
        title: 'Events',
        url: '/events',
        icon: Search,
      },
    ],
    navAdmin: [
      {
        title: 'Create Event',
        url: '/admin/events',
        icon: CalendarPlus2,
      },
      {
        title: 'History of Transactions',
        url: '/admin/tickets',
        icon: WalletCards,
      },
    ],
    user: session
      ? {
          name: session?.user?.name ? session.user.name : 'John Doe',
          email: session?.user?.email ? session.user.email : '',
        }
      : { name: 'John Doe', email: '' },
  };
  return (
    <>
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">EventlyTest</span>
                    <span className="">v1.0.0</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <NavMain items={data2.navMain} />
          <SidebarSeparator className="mx-0" />
          <NavMain items={data2.navAdmin} />
          {/* ACA LOS LINKS PARA ADMIN */}
        </SidebarHeader>
        <SidebarContent></SidebarContent>
        <SidebarFooter>
          <NavUser user={data2.user} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
