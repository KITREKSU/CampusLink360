import { BottomNavigation } from "@/components/BottomNavigation";

type PageContainerProps = {
  children: React.ReactNode;
  showBottomNav?: boolean;
};

export function PageContainer({ children, showBottomNav = true }: PageContainerProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-gradient-to-b from-cyan-50 via-white to-emerald-50 text-slate-950 shadow-2xl shadow-cyan-950/10">
      <div className="min-h-screen px-5 pb-28 pt-5">{children}</div>
      {showBottomNav ? <BottomNavigation /> : null}
    </main>
  );
}
