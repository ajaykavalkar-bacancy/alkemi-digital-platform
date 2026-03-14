"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe2, Lock, ShoppingBag } from "lucide-react";
import { type Card } from "@/lib/types";
import { maskCardNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card as SurfaceCard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function CardControls({ cards }: { cards: Card[] }) {
  const router = useRouter();
  const [items, setItems] = useState(cards);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function readJson<T>(response: Response): Promise<T | null> {
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return null;
    }

    try {
      return (await response.json()) as T;
    } catch {
      return null;
    }
  }

  async function updateCard(cardId: string, patch: Partial<Card>) {
    setMessage("");

    const response = await fetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    if (!response.ok) {
      setMessage("Card update failed.");
      return;
    }

    const updatedCard = await readJson<Card>(response);

    if (!updatedCard) {
      setMessage("Card update failed.");
      return;
    }

    setItems((current) => current.map((item) => (item.id === cardId ? updatedCard : item)));
    setMessage("Card controls updated.");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      {items.map((card) => (
        <SurfaceCard key={card.id}>
          <CardHeader className="md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>{maskCardNumber(card.card_number)}</CardTitle>
              <CardDescription>Instant controls for card security and commerce settings.</CardDescription>
            </div>
            <Badge variant={card.status === "active" ? "success" : "warning"}>{card.status}</Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <button
              type="button"
              className="rounded-3xl border border-border/70 bg-background/70 p-4 text-left"
              onClick={() =>
                startTransition(() =>
                  void updateCard(card.id, {
                    status: card.status === "active" ? "frozen" : "active",
                  }),
                )
              }
              disabled={isPending}
            >
              <div className="mb-4 inline-flex rounded-2xl bg-accent p-3 text-accent-foreground">
                <Lock className="h-4 w-4" />
              </div>
              <p className="font-medium">{card.status === "active" ? "Freeze card" : "Unfreeze card"}</p>
              <p className="mt-2 text-sm text-muted-foreground">Temporarily block card-present and online transactions.</p>
            </button>

            <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
              <div className="mb-4 inline-flex rounded-2xl bg-accent p-3 text-accent-foreground">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Online payments</p>
                  <p className="mt-2 text-sm text-muted-foreground">Authorize ecommerce and wallet transactions.</p>
                </div>
                <Switch
                  checked={card.online_payments_enabled}
                  onCheckedChange={(checked) =>
                    startTransition(() =>
                      void updateCard(card.id, {
                        online_payments_enabled: checked,
                      }),
                    )
                  }
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
              <div className="mb-4 inline-flex rounded-2xl bg-accent p-3 text-accent-foreground">
                <Globe2 className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">International usage</p>
                  <p className="mt-2 text-sm text-muted-foreground">Allow purchases while traveling abroad.</p>
                </div>
                <Switch
                  checked={card.international_enabled}
                  onCheckedChange={(checked) =>
                    startTransition(() =>
                      void updateCard(card.id, {
                        international_enabled: checked,
                      }),
                    )
                  }
                  disabled={isPending}
                />
              </div>
            </div>
          </CardContent>
        </SurfaceCard>
      ))}

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
