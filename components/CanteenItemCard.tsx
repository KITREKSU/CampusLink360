import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { CanteenItem } from "@/lib/data";

const statusStyles = {
  Available: {
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  Limited: {
    className: "bg-amber-50 text-amber-700",
    icon: Clock3,
  },
  "Not Available": {
    className: "bg-slate-100 text-slate-500",
    icon: XCircle,
  },
};

export function CanteenItemCard({ item }: { item: CanteenItem }) {
  const status = statusStyles[item.status];
  const Icon = status.icon;

  return (
    <article className="touch-lift glass-panel flex items-center justify-between gap-4 rounded-[22px] p-4">
      <div className="min-w-0">
        <h3 className="truncate text-base font-black text-slate-950">{item.name}</h3>
        <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${status.className}`}>
          <Icon size={13} />
          <span>{item.status}</span>
        </div>
      </div>
      <p className="shrink-0 rounded-2xl bg-sky-950 px-3 py-2 text-sm font-black text-cyan-50">{item.price}</p>
    </article>
  );
}
