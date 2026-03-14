import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CardControls } from "@/components/card-controls";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCards } from "@/lib/data";
import { requireViewer } from "@/lib/session";

export default async function CardsPage() {
  const viewer = await requireViewer();
  const cards = await getCards(viewer);

  return (
    <AppShell
      viewer={viewer}
      title="Cards"
      description="Control security, online commerce, and international usage from one secure panel."
    >
      <div className="space-y-6">
        <Card className="bg-slate-950 text-white">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Card security center</CardTitle>
              <CardDescription className="text-slate-300">
                Freeze your card, manage payment channels, and prepare for travel instantly.
              </CardDescription>
            </div>
            <ShieldCheck className="h-6 w-6 text-teal-200" />
          </CardHeader>
          <CardContent />
        </Card>
        <CardControls cards={cards} />
      </div>
    </AppShell>
  );
}
