import { PageCurtain, RevealController } from "@/components/ui/Motion";

/** Re-mounts on every navigation: curtain wipe, page rise-in, and scroll reveals. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageCurtain />
      <div className="animate-rise">{children}</div>
      <RevealController />
    </>
  );
}
