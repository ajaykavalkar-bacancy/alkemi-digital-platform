"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CreditCard, Gauge, Lightbulb, Menu, Repeat, Shield, Wallet, ArrowRightLeft } from "lucide-react";
import { type Viewer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/transactions", label: "Transactions", icon: Repeat },
  { href: "/transfer", label: "Transfer", icon: ArrowRightLeft },
  { href: "/cards", label: "Cards", icon: CreditCard },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/admin", label: "Admin", icon: Shield, adminOnly: true },
];

function SidebarLinks({ viewer, onNavigate }: { viewer: Viewer; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {navItems
        .filter((item) => !item.adminOnly || viewer.role === "admin")
        .map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-slate-300 hover:bg-white/10 hover:text-amber-100",
              )}
            >
              <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </Link>
          );
        })}
    </nav>
  );
}

export function Sidebar({ viewer }: { viewer: Viewer }) {
  return (
    <aside className="relative sticky top-6 hidden h-[calc(100vh-3rem)] w-72 flex-col overflow-hidden rounded-[2rem] border border-cyan-200/30 bg-slate-950 px-6 py-8 text-white shadow-soft dark:border-cyan-900/35 lg:flex">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(54,187,164,0.35),transparent_34%),radial-gradient(circle_at_100%_0%,rgba(220,166,76,0.28),transparent_30%)]" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-10">
          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.34em] text-amber-100">
            MoneyMind
          </div>
          <h2 className="mt-4 font-display text-3xl font-semibold text-white">Digital Banking</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Refined finance workflows for executive walkthroughs and stakeholder briefings.
          </p>
        </div>

        <SidebarLinks viewer={viewer} />

        <div className="mt-auto rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur">
          <p className="font-display text-xl font-medium text-white">{viewer.fullName}</p>
          <p className="mt-1 text-sm text-slate-300">{viewer.email}</p>
        </div>
      </div>
    </aside>
  );
}

export function MobileSidebar({ viewer }: { viewer: Viewer }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="left-0 top-0 h-full w-[85vw] max-w-sm translate-x-0 translate-y-0 rounded-none border-r border-border p-0">
        <div className="flex h-full flex-col bg-slate-950 p-6 text-white">
          <div className="mb-8">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.34em] text-amber-100">
              MoneyMind
            </div>
          </div>
          <SidebarLinks viewer={viewer} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
