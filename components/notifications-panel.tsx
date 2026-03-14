import { BellRing } from "lucide-react";
import { type AppNotification } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const variants = {
  transaction: "default",
  transfer: "success",
  warning: "warning",
  insight: "outline",
} as const;

export function NotificationsPanel({
  notifications,
  compact = false,
}: {
  notifications: AppNotification[];
  compact?: boolean;
}) {
  const visibleNotifications = compact ? notifications.slice(0, 5) : notifications;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications center</CardTitle>
        <CardDescription>Alerts for transactions, transfers, and balance monitoring.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleNotifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/70 p-4"
          >
            <div className="rounded-2xl bg-accent p-2 text-accent-foreground">
              <BellRing className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={variants[notification.type]}>{notification.type}</Badge>
                <span className="text-xs text-muted-foreground">{formatRelativeTime(notification.created_at)}</span>
              </div>
              <p className="mt-2 text-sm">{notification.message}</p>
            </div>
          </div>
        ))}

        {!visibleNotifications.length ? <p className="text-sm text-muted-foreground">No notifications available.</p> : null}
      </CardContent>
    </Card>
  );
}
