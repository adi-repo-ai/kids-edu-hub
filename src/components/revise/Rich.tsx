import { Fragment } from "react";

/** Renders the little Markdown that lesson callouts use: **bold**, line breaks and "- " bullets. */
export function Rich({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n").filter((l) => l.trim());
  const inline = (s: string) =>
    s.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i} className="font-extrabold text-ink">{part}</strong> : <Fragment key={i}>{part.replace(/(^|\s)[*_](\S[^*_]*?)[*_](?=\s|$|[.,;:])/g, "$1$2")}</Fragment>));
  return (
    <div className={className}>
      {lines.map((l, i) =>
        /^\s*[-*]\s/.test(l) ? (
          <p key={i} className="flex gap-2">
            <span aria-hidden>•</span>
            <span>{inline(l.replace(/^\s*[-*]\s/, ""))}</span>
          </p>
        ) : (
          <p key={i}>{inline(l)}</p>
        ),
      )}
    </div>
  );
}
