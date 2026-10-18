import type { ReactNode } from "react";
import { Mascot } from "./Mascot";

export function EmptyState({ title, body, action, mood = "think" }: { title: string; body: ReactNode; action?: ReactNode; mood?: "think" | "happy" | "wave" }) {
  return (
    <div className="card flex flex-col items-center px-6 py-10 text-center">
      <Mascot mood={mood} size={88} />
      <p className="mt-4 text-lg font-extrabold">{title}</p>
      <div className="mx-auto mt-1 max-w-md text-ink-2">{body}</div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
