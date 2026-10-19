import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/noto-sans-devanagari";
import "@fontsource-variable/lexend";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { bootScript, THEME_COLORS } from "@/components/settings/boot";
import { SettingsSync } from "@/components/settings/SettingsSync";

export const metadata: Metadata = {
  title: { default: "Kaksha · CBSE learning for Classes 1–12", template: "%s · Kaksha" },
  description: "Concept lessons, quizzes, mock tests, past papers and notes for every CBSE class from 1 to 12, with progress that saves.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The boot script sets theme/size/language attributes on <html> before React hydrates.
    <html lang="en-IN" data-theme="light" data-mode="senior" data-text="md" data-font="default" data-spacing="normal" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-dvh">
        <SettingsSync />
        {children}
      </body>
    </html>
  );
}
