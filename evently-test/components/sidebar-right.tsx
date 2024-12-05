'use client';
import * as React from 'react';
import { DatePicker } from '@/components/date-picker';
import {
  Sidebar,
  SidebarContent,
  SidebarSeparator,
} from '@/components/ui/sidebar';

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l"
      {...props}
    >
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
      </SidebarContent>
    </Sidebar>
  );
}
