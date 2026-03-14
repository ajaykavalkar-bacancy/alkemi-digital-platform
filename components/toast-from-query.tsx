"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/toast-provider";

export function ToastFromQuery() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const message = params.get("toast");
    if (!message) {
      return;
    }

    const type = params.get("toastType");
    const key = `${pathname}|${message}|${type ?? ""}`;
    if (lastKeyRef.current === key) {
      return;
    }

    lastKeyRef.current = key;
    toast({
      title: message,
      variant: type === "error" ? "error" : type === "info" ? "info" : "success",
    });

    const nextParams = new URLSearchParams(params.toString());
    nextParams.delete("toast");
    nextParams.delete("toastType");
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [params, pathname, router, toast]);

  return null;
}
