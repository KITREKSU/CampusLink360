import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

type LoginRequiredPanelProps = {
  title: string;
  description: string;
};

export function LoginRequiredPanel({ title, description }: LoginRequiredPanelProps) {
  return (
    <section className="mt-8 rounded-[30px] bg-gradient-to-br from-sky-950 via-sky-800 to-teal-600 p-5 text-white shadow-2xl shadow-sky-950/20">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
        <LockKeyhole size={26} />
      </div>
      <h1 className="mt-6 text-3xl font-black leading-tight">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-cyan-50">{description}</p>
      <p className="mt-5 rounded-2xl bg-white/12 p-4 text-sm font-semibold text-white">
        Login required / Coming soon
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-sky-950 shadow-lg"
      >
        <ArrowLeft size={17} />
        Back to Home
      </Link>
    </section>
  );
}
