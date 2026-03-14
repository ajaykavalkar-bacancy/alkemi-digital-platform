import dynamic from "next/dynamic";
import { signOutAction } from "@/lib/session";
import { type Viewer } from "@/lib/types";
import { MobileSidebar } from "@/components/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ThemeToggle = dynamic(() => import("./theme-toggle").then((mod) => mod.ThemeToggle), {
  ssr: false,
});

interface NavbarProps {
  title: string;
  description: string;
  viewer: Viewer;
}

export function Navbar({ title, description, viewer }: NavbarProps) {
  const initials = viewer.fullName
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="glass reveal-in rounded-[2rem] border border-white/60 px-5 py-4 shadow-soft dark:border-white/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <MobileSidebar viewer={viewer} />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-semibold">{title}</h1>
          <Badge variant="default">Live session</Badge>
            </div>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden items-center gap-3 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 sm:flex">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{viewer.fullName}</p>
              <p className="text-xs text-muted-foreground">{viewer.email}</p>
            </div>
          </div>
          <form action={signOutAction}>
            <Button variant="outline" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
