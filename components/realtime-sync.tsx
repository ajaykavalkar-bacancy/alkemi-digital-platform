"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { type AppRole } from "@/lib/types";

interface RealtimeSyncProps {
  viewerId: string;
  role: AppRole;
}

const USER_TABLES = [
  "accounts",
  "transactions",
  "transfers",
  "cards",
  "notifications",
] as const;

export function RealtimeSync({ viewerId, role }: RealtimeSyncProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshRequestedRef = useRef(false);

  useEffect(() => {

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const tables = role === "admin" ? [...USER_TABLES, "users"] : [...USER_TABLES];
    const channel = supabase.channel(`moneymind-live-${role}-${viewerId}`);

    const requestRefresh = () => {
      if (refreshRequestedRef.current) {
        return;
      }

      refreshRequestedRef.current = true;
      refreshTimerRef.current = setTimeout(() => {
        startTransition(() => {
          router.refresh();
          refreshRequestedRef.current = false;
        });
      }, 400);
    };

    for (const table of tables) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        requestRefresh,
      );
    }

    channel.subscribe();

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      void supabase.removeChannel(channel);
    };
  }, [role, router, viewerId]);

  return isPending ? (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 rounded-full bg-slate-900/90 px-3 py-1 text-xs text-white">
      Syncing live updates...
    </div>
  ) : null;
}
