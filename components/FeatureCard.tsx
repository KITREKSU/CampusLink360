import Link from "next/link";
import { LockKeyhole, type LucideIcon } from "lucide-react";

type FeatureCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  isOpen?: boolean;
};

export function FeatureCard({ title, description, href, icon: Icon, isOpen }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="touch-lift glass-panel flex min-h-36 flex-col justify-between rounded-[24px] p-4"
      aria-label={`${title}${isOpen ? "" : " login required"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-900 to-teal-500 text-white shadow-lg shadow-cyan-900/20">
          <Icon size={21} />
        </span>
        {!isOpen ? (
          <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-50 text-teal-700" title="Login required">
            <LockKeyhole size={15} />
          </span>
        ) : null}
      </div>
      <div>
        <h3 className="text-sm font-black text-slate-950">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
      </div>
    </Link>
  );
}
