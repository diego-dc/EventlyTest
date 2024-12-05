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
} from 'lucide-react';

import { NavFavorites } from '@/components/nav-favorites';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavWorkspaces } from '@/components/nav-workspaces';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Session } from 'inspector/promises';
import { useSession } from 'next-auth/react';
import { NavUser } from './nav-user';

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  // This is sample data.
  const data2 = {
    navMain: [
      {
        title: 'Events',
        url: '#',
        icon: Search,
      },
    ],
    user: session
      ? {
          name: session.user?.name ? session.user.name : 'John Doe',
          email: session.user?.email ? session.user.email : '',
        }
      : { name: 'John Doe', email: '' },
  };
  return (
    <>
      {session ? (
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
                      <span className="font-semibold">Documentation</span>
                      <span className="">v1.0.0</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <NavMain items={data2.navMain} />
            <SidebarSeparator className="mx-0" />
            {/* ACA LOS LINKS PARA ADMIN */}
          </SidebarHeader>
          <SidebarContent></SidebarContent>
          <SidebarFooter>
            <NavUser user={data2.user} />
          </SidebarFooter>
        </Sidebar>
      ) : (
        <p>Go to login</p>
      )}
    </>
  );
}
