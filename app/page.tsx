import Image from "next/image";
import { AppHeader } from "@/components/AppHeader";
import { EventCarousel } from "@/components/EventCarousel";
import { FeatureCard } from "@/components/FeatureCard";
import { PageContainer } from "@/components/PageContainer";
import { features } from "@/lib/data";

export default function Home() {
  return (
    <PageContainer>
      <AppHeader subtitle="Smart campus app" />

      <section className="mt-6 overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-950 via-sky-800 to-teal-600 p-5 text-white shadow-2xl shadow-sky-950/24">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[26px] bg-white p-2 shadow-xl shadow-sky-950/20">
            <Image src="/logo.png" alt="CampusLink360 logo" width={150} height={150} className="h-full w-full object-contain" priority />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="whitespace-nowrap text-[22px] font-black leading-none">CampusLink360</h1>
            <p className="mt-2 text-sm font-bold text-cyan-100">Smart Digital Campus Management System</p>
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-cyan-50">
          A unified mobile platform for students, teachers, parents, drivers, and college administration to access campus
          updates, canteen menu, academic information, bus tracking, and communication services.
        </p>
      </section>

      <EventCarousel />

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Quick Access</p>
            <h2 className="text-xl font-black text-slate-950">Campus Services</h2>
          </div>
          <p className="text-xs font-semibold text-slate-400">Mobile only</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
