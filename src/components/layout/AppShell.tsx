"use client";

import { ChevronDown, Flame, Menu, Search, X, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { grades } from "@/lib/curriculum";
import { cn } from "@/lib/cn";
import { actions, streakOf, useHydrated, useStore } from "@/lib/store";
import { Toaster } from "../ui/Toaster";
import { Logo } from "./Logo";
import { isActive, mainNav, moreNav } from "./nav";
import { Onboarding } from "./Onboarding";
import { SearchBox } from "./SearchBox";

function NavLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: typeof Flame; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-bold transition-colors",
        active ? "bg-brand-50 text-brand-700" : "text-ink-2 hover:bg-surface-2 hover:text-ink",
      )}
    >
      <Icon aria-hidden className={cn("size-5", active ? "text-brand-600" : "text-ink-3")} strokeWidth={2.2} />
      {label}
    </Link>
  );
}

function ClassSwitcher() {
  const grade = useStore((s) => s.profile.grade);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const off = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", off);
    return () => document.removeEventListener("pointerdown", off);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 items-center gap-1.5 rounded-xl border-2 border-line bg-surface px-3 text-sm font-extrabold hover:border-line-strong"
      >
        {grade ? `Class ${grade}` : "Choose class"}
        <ChevronDown aria-hidden className="size-4 text-ink-3" />
      </button>
      {open && (
        <ul role="listbox" aria-label="Your class" className="animate-rise absolute left-0 top-[calc(100%+6px)] z-50 grid w-56 grid-cols-3 gap-1.5 rounded-2xl border border-line bg-surface p-2 shadow-float">
          {grades.map((g) => (
            <li key={g.grade}>
              <button
                type="button"
                role="option"
                aria-selected={grade === g.grade}
                onClick={() => {
                  actions.setProfile({ grade: g.grade });
                  setOpen(false);
                }}
                className={cn("h-11 w-full rounded-xl text-sm font-extrabold", grade === g.grade ? "bg-brand-500 text-white" : "bg-surface-2 hover:bg-brand-50 hover:text-brand-700")}
              >
                {g.grade}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stats() {
  const hydrated = useHydrated();
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => streakOf(s.activity));
  if (!hydrated) return null;
  return (
    <div className="flex items-center gap-1">
      <Link href="/progress" className="flex h-10 items-center gap-1 rounded-xl px-2.5 text-sm font-extrabold text-coral-600 hover:bg-coral-50" aria-label={`${streak} day streak`}>
        <Flame aria-hidden className={cn("size-5", streak ? "fill-coral-500" : "")} />
        {streak}
      </Link>
      <Link href="/progress" className="flex h-10 items-center gap-1 rounded-xl px-2.5 text-sm font-extrabold text-amber-600 hover:bg-amber-50" aria-label={`${xp} XP`}>
        <Zap aria-hidden className="size-5 fill-amber-400" />
        {xp.toLocaleString("en-IN")}
      </Link>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const name = useStore((s) => s.profile.name);
  const [sheet, setSheet] = useState<null | "search" | "more">(null);
  useEffect(() => setSheet(null), [path]);

  return (
    <div className="min-h-dvh lg:pl-64">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[70] focus:rounded-lg focus:bg-ink focus:px-3 focus:py-2 focus:text-white">
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-surface px-4 py-5 lg:flex">
        <div className="px-2">
          <Logo href="/dashboard" />
        </div>
        <nav aria-label="Main" className="mt-8 flex-1 space-y-1 overflow-y-auto">
          {mainNav.map((n) => (
            <NavLink key={n.href} {...n} active={isActive(path, n)} />
          ))}
          <p className="eyebrow px-3 pb-1 pt-5">More</p>
          {moreNav.map((n) => (
            <NavLink key={n.href} {...n} active={isActive(path, n)} />
          ))}
        </nav>
        <div className="rounded-2xl bg-brand-50 p-4">
          <p className="text-sm font-extrabold text-brand-800">Free for every CBSE student</p>
          <p className="mt-1 text-xs text-brand-700">Progress is saved on this device.</p>
        </div>
      </aside>

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <div className="lg:hidden">
            <Logo href="/dashboard" />
          </div>
          <div className="hidden sm:block">
            <ClassSwitcher />
          </div>
          <SearchBox className="hidden max-w-md flex-1 md:block" />
          <div className="ml-auto flex items-center gap-1">
            <button type="button" aria-label="Search" onClick={() => setSheet("search")} className="grid size-10 place-items-center rounded-xl text-ink-2 hover:bg-surface-2 md:hidden">
              <Search className="size-5" aria-hidden />
            </button>
            <Stats />
            <Link href="/progress" className="ml-1 grid size-10 place-items-center rounded-full bg-brand-500 text-sm font-extrabold text-white" aria-label="My progress">
              {(name || "S").slice(0, 1).toUpperCase()}
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav aria-label="Quick" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
        <ul className="grid grid-cols-5">
          {[mainNav[0], mainNav[1], mainNav[2], mainNav[3]].map((n) => {
            const active = isActive(path, n);
            return (
              <li key={n.href}>
                <Link href={n.href} aria-current={active ? "page" : undefined} className={cn("flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold", active ? "text-brand-600" : "text-ink-3")}>
                  <span className={cn("grid h-7 w-12 place-items-center rounded-full", active && "bg-brand-50")}>
                    <n.icon aria-hidden className="size-5" strokeWidth={active ? 2.5 : 2} />
                  </span>
                  {n.label.split(" ")[0]}
                </Link>
              </li>
            );
          })}
          <li>
            <button type="button" onClick={() => setSheet("more")} className="flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-bold text-ink-3">
              <span className="grid h-7 w-12 place-items-center rounded-full">
                <Menu aria-hidden className="size-5" />
              </span>
              More
            </button>
          </li>
        </ul>
      </nav>

      {sheet && (
        <div role="dialog" aria-modal="true" aria-label={sheet === "search" ? "Search" : "More"} className="fixed inset-0 z-50 bg-ink/40 lg:hidden" onClick={(e) => e.target === e.currentTarget && setSheet(null)}>
          <div className="animate-rise absolute inset-x-0 bottom-0 rounded-t-3xl bg-surface p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-lg font-extrabold">{sheet === "search" ? "Search" : "More"}</p>
              <button type="button" aria-label="Close" onClick={() => setSheet(null)} className="grid size-10 place-items-center rounded-xl hover:bg-surface-2">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            {sheet === "search" ? (
              <SearchBox autoFocus large onDone={() => setSheet(null)} />
            ) : (
              <div className="space-y-4">
                <ClassSwitcher />
                <nav aria-label="More" className="grid grid-cols-2 gap-1">
                  {[...mainNav.slice(4), ...moreNav].map((n) => (
                    <NavLink key={n.href} {...n} active={isActive(path, n)} />
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      )}

      <Onboarding />
      <Toaster />
    </div>
  );
}
