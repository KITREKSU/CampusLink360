"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus, Home, LogIn, Soup } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Canteen", href: "/canteen", icon: Soup },
  { label: "Bus", href: "/bus", icon: Bus },
  { label: "Login", href: "/login", icon: LogIn },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] border-t border-cyan-100/80 bg-white/90 px-4 pb-4 pt-2 shadow-[0_-14px_35px_rgba(8,47,73,0.14)] backdrop-blur-2xl">
      <div className="grid grid-cols-4 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition ${
                isActive
                  ? "bg-gradient-to-br from-sky-900 to-teal-600 text-white shadow-lg shadow-teal-900/20"
                  : "text-slate-500 active:bg-cyan-50"
              }`}
            >
              <Icon size={19} strokeWidth={2.3} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
