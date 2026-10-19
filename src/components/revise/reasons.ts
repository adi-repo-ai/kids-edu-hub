"use client";

import { strings, useT } from "@/lib/i18n";
import type { RevisionReason } from "@/lib/revision";

const S = strings({
  en: {
    reason: (r: RevisionReason): string => {
      switch (r.kind) {
        case "new":
          return r.days === 1 ? "Finished yesterday, not revised yet" : `Finished ${r.days} days ago, not revised yet`;
        case "due":
          return r.days === 1 ? "Last revised 1 day ago" : `Last revised ${r.days} days ago`;
        case "quiz":
          return `Quiz score ${r.best}/${r.total}`;
        case "mistakes":
          return `${r.count} mistakes to fix`;
      }
    },
  },
  hi: {
    reason: (r: RevisionReason): string => {
      switch (r.kind) {
        case "new":
          return r.days === 1 ? "कल पूरा किया, अभी दोहराया नहीं" : `${r.days} दिन पहले पूरा किया, अभी दोहराया नहीं`;
        case "due":
          return `पिछली बार ${r.days} दिन पहले दोहराया`;
        case "quiz":
          return `क्विज़ स्कोर ${r.best}/${r.total}`;
        case "mistakes":
          return `${r.count} गलतियाँ सुधारनी हैं`;
      }
    },
  },
});

/** Human sentence for why a chapter is on the revision list. */
export function useReasonText() {
  return useT(S).reason;
}
