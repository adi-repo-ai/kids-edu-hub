"use client";

import { usePathname, useRouter } from "next/navigation";

declare global {
  interface Window {
    /** Installed only by the static preview build, where client-side routing is unavailable. */
    __kakshaGo?: (href: string) => void;
    /** URL path the static preview is served from, e.g. "/some/host/prefix/app/". */
    __kakshaBase?: string;
  }
}

/** router.push, unless the static preview shim provides a full-page navigator. */
export function useNavigate() {
  const router = useRouter();
  return (href: string) => (window.__kakshaGo ? window.__kakshaGo(href) : router.push(href));
}

/** The app route ("/dashboard"), also when the static preview is served from a sub-path. */
export function useRoutePath() {
  const pathname = usePathname();
  const base = typeof window === "undefined" ? undefined : window.__kakshaBase;
  if (!base || !pathname.startsWith(base)) return pathname;
  return ("/" + pathname.slice(base.length)).replace(/index\.html$/, "");
}
