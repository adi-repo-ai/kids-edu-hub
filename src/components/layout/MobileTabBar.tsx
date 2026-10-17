"use client";

import { BookOpen, Bookmark, CalendarDays, House, Target } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useRoutePath } from "@/lib/navigate";
import { isActive } from "./SiteHeader";

const tabs = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/class/8", label: "Learn", icon: BookOpen, match: ["/class", "/learn", "/lesson"] },
  { href: "/practice", label: "Practice", icon: Target },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/planner", label: "Planner", icon: CalendarDays },
];

/** Thumb-zone navigation for phones and small tablets. Every target is ≥ 56px tall. */
export function MobileTabBar() {
  const pathname = useRoutePath();
  return (
    <nav aria-label="Quick access" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = isActive(pathname, { href, match });
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors", active ? "text-royal-700" : "text-ink-3")}
              >
                <span className={cn("grid h-7 w-12 place-items-center rounded-full transition-colors", active && "bg-royal-100")}>
                  <Icon aria-hidden className="size-5" strokeWidth={active ? 2.4 : 2} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
