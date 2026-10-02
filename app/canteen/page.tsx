"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CanteenItemCard } from "@/components/CanteenItemCard";
import { PageContainer } from "@/components/PageContainer";
import { canteenMenu, categories, type CanteenItem } from "@/lib/data";

type Category = CanteenItem["category"] | "All";

export default function CanteenPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");

  const filteredMenu = useMemo(() => {
    return canteenMenu.filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesCategory = category === "All" || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, query]);

  const groupedMenu = categories
    .map((menuCategory) => ({
      category: menuCategory,
      items: filteredMenu.filter((item) => item.category === menuCategory),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <PageContainer>
      <AppHeader title="Canteen Menu" subtitle="Open without login" showBack />

      <section className="mt-6 rounded-[30px] bg-gradient-to-br from-sky-950 via-sky-800 to-teal-600 p-5 text-white shadow-2xl shadow-sky-950/20">
        <p className="text-xs font-bold uppercase tracking-wide text-cyan-100">Today&apos;s Menu</p>
        <h1 className="mt-2 text-3xl font-black">Fresh on Campus</h1>
        <p className="mt-3 text-sm leading-6 text-cyan-50">
          Browse sample items, prices, and availability for breakfast, lunch, snacks, and drinks.
        </p>
      </section>

      <section className="mt-5">
        <div className="glass-panel flex items-center gap-2 rounded-2xl px-4 py-3">
          <Search size={18} className="text-teal-700" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search menu"
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(["All", ...categories] as Category[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`h-10 shrink-0 rounded-full px-4 text-xs font-black transition ${
                category === item
                  ? "bg-sky-950 text-white shadow-lg shadow-sky-950/18"
                  : "bg-white text-slate-500 shadow-sm shadow-cyan-950/8"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 space-y-6">
        {groupedMenu.map((group) => (
          <div key={group.category}>
            <h2 className="mb-3 text-lg font-black text-slate-950">{group.category}</h2>
            <div className="space-y-3">
              {group.items.map((item) => (
                <CanteenItemCard key={`${item.category}-${item.name}`} item={item} />
              ))}
            </div>
          </div>
        ))}
        {groupedMenu.length === 0 ? (
          <div className="glass-panel rounded-[24px] p-5 text-center text-sm font-semibold text-slate-500">
            No menu items found.
          </div>
        ) : null}
      </section>

      <p className="mt-6 rounded-2xl bg-cyan-50 p-4 text-xs font-semibold leading-5 text-teal-800">
        Menu and price are updated by college/canteen admin.
      </p>
    </PageContainer>
  );
}
