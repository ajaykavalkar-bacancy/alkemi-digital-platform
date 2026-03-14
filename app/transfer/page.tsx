import { AppShell } from "@/components/app-shell";
import { NotificationsPanel } from "@/components/notifications-panel";
import { TransferEmptyState } from "@/components/transfer-empty-state";
import { TransferForm } from "@/components/transfer-form";
import { getDashboardSnapshot } from "@/lib/data";
import { requireViewer } from "@/lib/session";

export default async function TransferPage() {
  const viewer = await requireViewer();
  const snapshot = await getDashboardSnapshot(viewer);

  return (
    <AppShell
      viewer={viewer}
      title="Transfer"
      description="Move money between linked accounts and trigger the full banking workflow."
    >
      <div className="space-y-6">
        {snapshot.accounts.length < 2 ? (
          <TransferEmptyState accountsCount={snapshot.accounts.length} />
        ) : (
          <TransferForm accounts={snapshot.accounts} />
        )}
        <NotificationsPanel notifications={snapshot.notifications} compact />
      </div>
    </AppShell>
  );
}
