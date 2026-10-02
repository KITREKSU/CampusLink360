import { AppHeader } from "@/components/AppHeader";
import { LoginRequiredPanel } from "@/components/LoginRequiredPanel";
import { PageContainer } from "@/components/PageContainer";

export default function ScoreCardPage() {
  return (
    <PageContainer>
      <AppHeader title="Score Card" subtitle="Login required" showBack />
      <LoginRequiredPanel
        title="Score Card"
        description="Academic score updates and performance summaries will be shown here after authentication and data setup."
      />
    </PageContainer>
  );
}
