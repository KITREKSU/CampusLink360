import { AppHeader } from "@/components/AppHeader";
import { LoginRequiredPanel } from "@/components/LoginRequiredPanel";
import { PageContainer } from "@/components/PageContainer";

export default function NotificationsPage() {
  return (
    <PageContainer>
      <AppHeader title="Notifications" subtitle="Coming soon" showBack />
      <LoginRequiredPanel
        title="Notifications"
        description="Important college updates, alerts, and communication services will appear here after login is integrated."
      />
    </PageContainer>
  );
}
