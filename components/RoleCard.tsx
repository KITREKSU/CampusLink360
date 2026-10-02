"use client";

import { ShieldCheck, type LucideIcon } from "lucide-react";

type RoleCardProps = {
  label: string;
  icon?: LucideIcon;
  selected: boolean;
  onSelect: () => void;
};

export function RoleCard({ label, icon: Icon = ShieldCheck, selected, onSelect }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`touch-lift flex min-h-24 flex-col items-start justify-between rounded-[22px] border p-4 text-left ${
        selected
          ? "border-teal-400 bg-gradient-to-br from-sky-950 to-teal-600 text-white shadow-xl shadow-teal-900/20"
          : "border-cyan-100 bg-white/85 text-slate-800 shadow-lg shadow-cyan-950/8"
      }`}
    >
      <Icon size={22} />
      <span className="text-sm font-black">{label}</span>
    </button>
  );
}
