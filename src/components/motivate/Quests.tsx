"use client";

import { ArrowRight, Award, CheckCircle2, Gift, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import { confettiFrom } from "@/lib/confetti";
import { strings, useLang, useT } from "@/lib/i18n";
import { isDone, questsOf, type Quest } from "@/lib/quests";
import { actions, useHydrated, useStore } from "@/lib/store";
import { toast } from "@/lib/toast";
import { PageTitle } from "../layout/PageTitle";
import { Button, ButtonLink } from "../ui/Button";
import { ProgressBar } from "../ui/Progress";
import { SubjectIcon } from "../ui/SubjectIcon";
import { MyMascot } from "../ui/MyMascot";

const S = strings({
  en: {
    eyebrow: "Earn XP",
    title: "Quests",
    sub: "Goals that track what you really do in Kaksha. Finish one, claim your XP and print a certificate.",
    claimed: (a: number, b: number) => `${a} of ${b} claimed`,
    ready: (n: number) => (n === 1 ? "1 reward is ready to claim!" : `${n} rewards are ready to claim!`),
    none: "Keep going: every lesson, quiz and challenge moves your quests forward.",
    general: "Everyday quests",
    subjects: (g: number) => `Class ${g} subject quests`,
    subjectsAny: "Subject quests",
    noClass: "Pick your class from the top bar to unlock subject quests.",
    claim: (xp: number) => `Claim +${xp} XP`,
    claimedOn: (d: string) => `Claimed ${d}`,
    certificate: "Get certificate",
    go: "Work on it",
    reward: (xp: number) => `+${xp} XP`,
    toast: (title: string, xp: number) => `Quest complete: ${title} · +${xp} XP`,
    progress: (title: string) => `${title} progress`,
  },
  hi: {
    eyebrow: "XP कमाओ",
    title: "क्वेस्ट",
    sub: "ये लक्ष्य वही गिनते हैं जो तुम सच में Kaksha पर करते हो। कोई पूरा करो, XP लो और प्रमाणपत्र प्रिंट करो।",
    claimed: (a: number, b: number) => `${b} में से ${a} इनाम लिए`,
    ready: (n: number) => `${n} इनाम लेने के लिए तैयार हैं!`,
    none: "लगे रहो: हर पाठ, क्विज़ और चुनौती से तुम्हारे क्वेस्ट आगे बढ़ते हैं।",
    general: "रोज़ के क्वेस्ट",
    subjects: (g: number) => `कक्षा ${g} के विषय क्वेस्ट`,
    subjectsAny: "विषय क्वेस्ट",
    noClass: "विषय क्वेस्ट खोलने के लिए ऊपर से अपनी कक्षा चुनो।",
    claim: (xp: number) => `+${xp} XP लो`,
    claimedOn: (d: string) => `${d} को लिया`,
    certificate: "प्रमाणपत्र लो",
    go: "शुरू करो",
    reward: (xp: number) => `+${xp} XP`,
    toast: (title: string, xp: number) => `क्वेस्ट पूरा: ${title} · +${xp} XP`,
    progress: (title: string) => `${title} की प्रगति`,
  },
});

/** Claimable first, then nearest to done, then already claimed. */
function order(list: Quest[], claimed: Record<string, string>) {
  const rank = (q: Quest) => (claimed[q.id] ? 2 : isDone(q) ? 0 : 1);
  return [...list].sort((a, b) => rank(a) - rank(b) || b.have / b.need - a.have / a.need);
}

export function Quests() {
  const hydrated = useHydrated();
  const t = useT(S);
  const lang = useLang();
  const state = useStore((s) => s);
  if (!hydrated) return <div className="h-96" />;

  const { general, subjects } = questsOf(state);
  const all = [...general, ...subjects];
  const claimed = state.quests;
  const ready = all.filter((q) => isDone(q) && !claimed[q.id]).length;
  const claimedCount = all.filter((q) => claimed[q.id]).length;

  return (
    <div lang={lang}>
      <PageTitle eyebrow={t.eyebrow} title={t.title} sub={t.sub} />

      <div className="card mb-8 flex flex-wrap items-center gap-4 p-5">
        <MyMascot mood={ready ? "cheer" : "happy"} size={72} />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-extrabold">{ready ? t.ready(ready) : t.none}</p>
          <p className="mt-1 text-sm font-semibold text-ink-3">{t.claimed(claimedCount, all.length)}</p>
          <ProgressBar value={all.length ? (claimedCount / all.length) * 100 : 0} label={t.claimed(claimedCount, all.length)} color="bg-amber-400" className="mt-2 max-w-sm" />
        </div>
      </div>

      <section aria-labelledby="q-general">
        <h2 id="q-general" className="mb-4 text-xl font-extrabold">
          {t.general}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {order(general, claimed).map((q) => (
            <QuestCard key={q.id} q={q} claimedAt={claimed[q.id]} />
          ))}
        </div>
      </section>

      <section aria-labelledby="q-subjects" className="mt-10">
        <h2 id="q-subjects" className="mb-4 text-xl font-extrabold">
          {state.profile.grade ? t.subjects(state.profile.grade) : t.subjectsAny}
        </h2>
        {subjects.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {order(subjects, claimed).map((q) => (
              <QuestCard key={q.id} q={q} claimedAt={claimed[q.id]} />
            ))}
          </div>
        ) : (
          <p className="card p-5 text-ink-2">{t.noClass}</p>
        )}
      </section>
    </div>
  );
}

function QuestCard({ q, claimedAt }: { q: Quest; claimedAt?: string }) {
  const t = useT(S);
  const lang = useLang();
  const done = isDone(q);
  const title = q.title[lang];
  const pct = Math.min(100, (q.have / q.need) * 100);
  const date = claimedAt ? new Date(claimedAt).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <article className={cn("card flex min-w-0 flex-col p-5", done && !claimedAt && "ring-2 ring-amber-300")}>
      <div className="flex items-start gap-3">
        {q.kind === "subject" && q.subject ? (
          <SubjectIcon id={q.subject} />
        ) : (
          <span aria-hidden className={cn("grid size-11 shrink-0 place-items-center rounded-xl", claimedAt ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600")}>
            {claimedAt ? <CheckCircle2 className="size-5" /> : <Trophy className="size-5" />}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-extrabold leading-snug">{title}</h3>
          <p className="text-sm text-ink-2">{q.desc[lang]}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-700">
          <Zap aria-hidden className="size-3.5 fill-amber-400 text-amber-500" />
          {t.reward(q.xp)}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <ProgressBar value={pct} label={t.progress(title)} color={done ? "bg-green-500" : "bg-brand-500"} className="flex-1" />
        <span className="shrink-0 text-sm font-extrabold tabular-nums text-ink-2">
          {Math.min(q.have, q.need)}/{q.need}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 pt-1">
        {claimedAt ? (
          <>
            <span className="text-sm font-bold text-green-700">{t.claimedOn(date)}</span>
            <ButtonLink href={`/certificate?quest=${encodeURIComponent(q.id)}`} variant="secondary" size="sm" className="ml-auto" icon={<Award aria-hidden className="size-4" />}>
              {t.certificate}
            </ButtonLink>
          </>
        ) : done ? (
          <Button
            variant="success"
            size="sm"
            icon={<Gift aria-hidden className="size-4" />}
            onClick={(e) => {
              actions.claimQuest(q.id, q.xp);
              confettiFrom(e.currentTarget, { count: 90 });
              toast(t.toast(title, q.xp));
            }}
          >
            {t.claim(q.xp)}
          </Button>
        ) : (
          <ButtonLink href={q.href} variant="ghost" size="sm" iconRight={<ArrowRight aria-hidden className="size-4" />}>
            {t.go}
          </ButtonLink>
        )}
      </div>
    </article>
  );
}
