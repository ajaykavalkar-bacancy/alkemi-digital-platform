import { AppShell } from "@/components/app-shell";
import { NotificationsPanel } from "@/components/notifications-panel";
import { getNotifications } from "@/lib/data";
import { requireViewer } from "@/lib/session";

export default async function NotificationsPage() {
  const viewer = await requireViewer();
  const notifications = await getNotifications(viewer);

  return (
    <AppShell
      viewer={viewer}
      title="Notifications"
      description="Track every transfer confirmation, transaction alert, and low-balance warning."
    >
      <NotificationsPanel notifications={notifications} />
    </AppShell>
  );
}
