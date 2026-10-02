import { AppHeader } from "@/components/AppHeader";
import { LoginRequiredPanel } from "@/components/LoginRequiredPanel";
import { PageContainer } from "@/components/PageContainer";

export default function FeesPage() {
  return (
    <PageContainer>
      <AppHeader title="Fee Details" subtitle="Login required" showBack />
      <LoginRequiredPanel
        title="Fee Details"
        description="Official fee information and payment status will be connected here during the backend phase."
      />
    </PageContainer>
  );
}
