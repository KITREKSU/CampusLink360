import { CalendarDays } from "lucide-react";

const events = [
  {
    title: "Tech Fest Registration",
    date: "Sep 18",
    tone: "from-sky-950 via-sky-800 to-cyan-600",
  },
  {
    title: "Library Notice",
    date: "Sep 20",
    tone: "from-teal-800 via-cyan-700 to-emerald-500",
  },
  {
    title: "Internal Exam Schedule",
    date: "Sep 24",
    tone: "from-blue-950 via-indigo-800 to-teal-500",
  },
];

export function EventCarousel() {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">College Notices & Events</h2>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-bold text-teal-700">Today</span>
      </div>
      <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {events.map((event) => (
          <article
            key={event.title}
            className={`touch-lift relative h-36 w-[82%] shrink-0 snap-start overflow-hidden rounded-[28px] bg-gradient-to-br ${event.tone} p-5 text-white shadow-xl shadow-sky-950/18`}
          >
            <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full border border-white/25" />
            <div className="absolute -bottom-14 right-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-50">
                <CalendarDays size={16} />
                <span>{event.date}</span>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-100">Announcement</p>
                <h3 className="mt-1 max-w-[13rem] text-xl font-black leading-tight">{event.title}</h3>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
