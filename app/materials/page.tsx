import { AppHeader } from "@/components/AppHeader";
import { LoginRequiredPanel } from "@/components/LoginRequiredPanel";
import { PageContainer } from "@/components/PageContainer";

export default function MaterialsPage() {
  return (
    <PageContainer>
      <AppHeader title="Study Materials" subtitle="Coming soon" showBack />
      <LoginRequiredPanel
        title="Study Materials"
        description="Notes, PDFs, links, and assignments will appear here after role-based login is connected."
      />
    </PageContainer>
  );
}
