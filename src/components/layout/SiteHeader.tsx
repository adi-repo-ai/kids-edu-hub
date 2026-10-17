"use client";

import { Bell, ChevronDown, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { student } from "@/data/student";
import { cn } from "@/lib/cn";
import { SearchBox } from "../features/SearchBox";
import { Logo } from "./Logo";

export const primaryNav = [
  { href: "/dashboard", label: "My desk" },
  { href: "/class/8", label: "Subjects", match: ["/class", "/learn", "/lesson"] },
  { href: "/practice", label: "Practice" },
  { href: "/papers", label: "Past papers" },
  { href: "/library", label: "Notes" },
  { href: "/news", label: "News" },
];

const accountNav = [
  { href: "/planner", label: "Study planner" },
  { href: "/saved", label: "Saved items" },
  { href: "/parent", label: "Parent dashboard" },
  { href: "/design-system", label: "Design system" },
];

export function isActive(pathname: string, item: { href: string; match?: string[] }) {
  return [item.href, ...(item.match ?? [])].some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setMobileSearch(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: PointerEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="ml-4 hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-md px-3 py-2 text-[15px] font-semibold transition-colors",
                      active ? "text-ink" : "text-ink-2 hover:bg-sunken hover:text-ink",
                    )}
                  >
                    {item.label}
                    {active && <span aria-hidden className="absolute inset-x-3 -bottom-[13px] h-[3px] rounded-t-full bg-royal-600" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchBox shortcut className="hidden w-64 md:block lg:hidden xl:block xl:w-72" />
          <button
            type="button"
            onClick={() => setMobileSearch(true)}
            className="grid size-11 place-items-center rounded-md text-ink-2 hover:bg-sunken md:hidden lg:grid xl:hidden"
            aria-label="Open search"
          >
            <Search className="size-5" aria-hidden />
          </button>
          <Link href="/news" className="relative grid size-11 place-items-center rounded-md text-ink-2 hover:bg-sunken" aria-label="Announcements, 2 new">
            <Bell className="size-5" aria-hidden />
            <span aria-hidden className="absolute right-2.5 top-2.5 size-2 rounded-full bg-coral-500 ring-2 ring-paper" />
          </Link>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-1 rounded-md p-1 hover:bg-sunken"
            >
              <span className="grid size-9 place-items-center rounded-full bg-sun-400 text-sm font-bold text-ink">{student.initials}</span>
              <ChevronDown aria-hidden className="hidden size-4 text-ink-3 sm:block" />
              <span className="sr-only">Account menu</span>
            </button>
            {menuOpen && (
              <div role="menu" className="animate-rise absolute right-0 top-[calc(100%+8px)] w-60 rounded-lg border border-line bg-surface p-1.5 shadow-lift">
                <div className="border-b border-line px-3 pb-3 pt-2">
                  <p className="font-semibold">{student.fullName}</p>
                  <p className="text-sm text-ink-3">
                    Class {student.grade}-{student.section} · {student.school.split(",")[0]}
                  </p>
                </div>
                {accountNav.map((item) => (
                  <Link key={item.href} role="menuitem" href={item.href} className="block rounded-md px-3 py-2.5 text-[15px] font-medium text-ink-2 hover:bg-sunken hover:text-ink">
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileSearch && (
        <div role="dialog" aria-modal="true" aria-label="Search" className="fixed inset-0 z-50 bg-paper/98 md:bg-ink/30 md:pt-20">
          <div className="mx-auto flex max-w-2xl items-start gap-2 p-4 md:rounded-lg md:bg-paper">
            <SearchBox size="lg" autoFocus className="flex-1" onNavigate={() => setMobileSearch(false)} />
            <button type="button" onClick={() => setMobileSearch(false)} className="grid size-14 place-items-center rounded-md text-ink-2 hover:bg-sunken" aria-label="Close search">
              <X className="size-6" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
