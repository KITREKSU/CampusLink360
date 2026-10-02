import Link from "next/link";
import { Bus, Home, Soup } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { PageContainer } from "@/components/PageContainer";

const scannerPages = [
  {
    label: "Hostel",
    description: "Open the hostel-only card scanning display.",
    href: "/scanners/hostel",
    icon: Home,
  },
  {
    label: "Canteen",
    description: "Open the canteen-only payment scanner display.",
    href: "/scanners/canteen",
    icon: Soup,
  },
  {
    label: "Bus",
    description: "Open the bus-only pass scanner display.",
    href: "/scanners/bus",
    icon: Bus,
  },
];

export default function ScannersPage() {
  return (
    <PageContainer>
      <AppHeader title="Payment Scanners" subtitle="Choose scanner screen" showBack />

      <section className="mt-6 rounded-[30px] bg-gradient-to-br from-sky-950 via-sky-800 to-teal-600 p-5 text-white shadow-2xl shadow-sky-950/20">
        <h1 className="text-3xl font-black leading-tight">Scanner Screens</h1>
        <p className="mt-3 text-sm leading-6 text-cyan-50">
          Open a dedicated full scanner display for Hostel, Canteen, or Bus.
        </p>
      </section>

      <section className="mt-5 space-y-3">
        {scannerPages.map((page) => {
          const Icon = page.icon;
          return (
            <Link key={page.href} href={page.href} className="touch-lift glass-panel flex items-center gap-4 rounded-[24px] p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-900 to-teal-500 text-white shadow-lg shadow-cyan-900/20">
                <Icon size={23} />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-black text-slate-950">{page.label} Scanner</span>
                <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{page.description}</span>
              </span>
            </Link>
          );
        })}
      </section>
    </PageContainer>
  );
}
