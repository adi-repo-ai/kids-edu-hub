import Link from "next/link";
import { Mascot } from "@/components/ui/Mascot";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-4 text-center">
      <div>
        <Mascot mood="oops" size={130} className="mx-auto" />
        <h1 className="mt-4 text-3xl font-extrabold">We couldn&apos;t find that page</h1>
        <p className="mt-2 text-ink-2">The link may be old. Let&apos;s get you back on track.</p>
        <Link href="/dashboard" className="mt-6 inline-flex h-12 items-center rounded-xl border-b-4 border-brand-700 bg-brand-500 px-6 font-bold text-white">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
