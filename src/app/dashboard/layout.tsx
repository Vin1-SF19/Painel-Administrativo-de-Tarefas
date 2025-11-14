"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <AppSidebar />

        <div className="flex-1 p-4 overflow-auto">
          <SidebarTrigger />
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}
