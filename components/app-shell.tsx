import { type ReactNode } from "react";
import { type Viewer } from "@/lib/types";
import { Navbar } from "@/components/navbar";
import { RealtimeSync } from "@/components/realtime-sync";
import { Sidebar } from "@/components/sidebar";

interface AppShellProps {
  title: string;
  description: string;
  viewer: Viewer;
  children: ReactNode;
}

export function AppShell({ title, description, viewer, children }: AppShellProps) {
  return (
    <div className="page-shell">
  <div className="mx-auto flex min-h-screen max-w-7xl gap-6 p-4 lg:p-6">
    <Sidebar viewer={viewer} />
    <div className="flex-1 space-y-6">
      <RealtimeSync viewerId={viewer.id} role={viewer.role} />
      <Navbar title={title} description={description} viewer={viewer} />
      <main className="reveal-in reveal-stagger-1">{children}</main>
    </div>
  </div>
    </div>
  );
}
