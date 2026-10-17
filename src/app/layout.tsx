import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/figtree";
import "@fontsource-variable/caveat";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { AppStateProvider } from "@/components/features/AppState";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: { default: "Kaksha · CBSE learning for Classes 1–10", template: "%s · Kaksha" },
  description: "Interactive lessons, quizzes, past papers and notes for CBSE students, with progress tracking for parents.",
};

export const viewport: Viewport = { themeColor: "#fffbf3", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className="min-h-dvh">
        <AppStateProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <MobileTabBar />
        </AppStateProvider>
      </body>
    </html>
  );
}
