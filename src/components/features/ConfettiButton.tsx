"use client";

import { PartyPopper } from "lucide-react";
import { useRef } from "react";
import { confettiFrom } from "@/lib/confetti";
import { Button } from "../ui/Button";

export function ConfettiButton({ label, scrollTo }: { label: string; scrollTo?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <Button
      ref={ref}
      size="lg"
      variant="primary"
      icon={<PartyPopper className="size-5 group-hover/btn:animate-wiggle" aria-hidden />}
      onClick={() => {
        confettiFrom(ref.current, { count: 140, power: 1.2 });
        if (scrollTo) setTimeout(() => document.querySelector(scrollTo)?.scrollIntoView({ behavior: "smooth" }), 450);
      }}
    >
      {label}
    </Button>
  );
}
