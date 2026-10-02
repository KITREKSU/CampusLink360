"use client";

import { useState } from "react";
import { Bus, GraduationCap, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { PageContainer } from "@/components/PageContainer";
import { RoleCard } from "@/components/RoleCard";
import { roleNames } from "@/lib/data";

const roleIcons = {
  Student: GraduationCap,
  Teacher: UserRound,
  Parent: UsersRound,
  "Bus Driver": Bus,
  Admin: ShieldCheck,
};

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<(typeof roleNames)[number]>("Student");

  return (
    <PageContainer>
      <AppHeader title="Login" subtitle="Frontend preview" showBack />

      <section className="mt-6">
        <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Choose Role</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Campus Access</h1>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {roleNames.map((role) => (
            <RoleCard
              key={role}
              label={role}
              icon={roleIcons[role]}
              selected={selectedRole === role}
              onSelect={() => setSelectedRole(role)}
            />
          ))}
        </div>
      </section>

      <section className="glass-panel mt-6 rounded-[28px] p-5">
        <h2 className="text-lg font-black text-slate-950">{selectedRole} Login</h2>
        <label className="mt-4 block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Email / ID</span>
          <input
            type="text"
            placeholder="Enter email or college ID"
            className="mt-2 h-12 w-full rounded-2xl border border-cyan-100 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-teal-400"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Password</span>
          <input
            type="password"
            placeholder="Password"
            className="mt-2 h-12 w-full rounded-2xl border border-cyan-100 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-teal-400"
          />
        </label>
        <button
          type="button"
          disabled
          className="mt-5 h-12 w-full rounded-2xl bg-slate-200 text-sm font-black text-slate-400"
        >
          Login coming soon
        </button>
        <p className="mt-4 text-center text-xs font-semibold text-teal-700">
          Authentication integration will be added later.
        </p>
      </section>
    </PageContainer>
  );
}
