import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
};

export function AppHeader({ title = "CampusLink360", subtitle, showBack }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {showBack ? (
          <Link
            href="/"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cyan-100 bg-white text-sky-800 shadow-sm"
            aria-label="Back to home"
          >
            <ArrowLeft size={19} />
          </Link>
        ) : (
          <Image
            src="/icon.png"
            alt="CampusLink360 icon"
            width={44}
            height={44}
            className="h-11 w-11 rounded-2xl object-contain shadow-lg shadow-cyan-900/15"
            priority
          />
        )}
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-slate-950">{title}</p>
          {subtitle ? <p className="truncate text-xs font-medium text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full bg-sky-950 text-cyan-100 shadow-lg shadow-sky-950/20"
        aria-label="Notifications preview"
      >
        <Bell size={18} />
      </button>
    </header>
  );
}
