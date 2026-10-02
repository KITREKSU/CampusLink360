import { AppHeader } from "@/components/AppHeader";
import { LoginRequiredPanel } from "@/components/LoginRequiredPanel";
import { PageContainer } from "@/components/PageContainer";

export default function BusPage() {
  return (
    <PageContainer>
      <AppHeader title="Bus Tracking" subtitle="GPS integration later" showBack />
      <LoginRequiredPanel
        title="Bus Tracking"
        description="Live route maps and college bus location updates will be available after login and driver GPS setup."
      />
    </PageContainer>
  );
}
