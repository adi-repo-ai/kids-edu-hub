// Validates lesson and mock files: one correct option per MCQ, no duplicate options,
// at least 5 quiz questions per lesson, and every lesson id matching a real chapter.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const ids = new Set();
for (const f of readdirSync("src/content/curriculum")) {
  const src = readFileSync(join("src/content/curriculum", f), "utf8");
  for (const m of src.matchAll(/ch\(\s*"([^"]+)"\s*,\s*(?:\[[^\]]*\]|[^,)]+)?\s*(?:,\s*"([^"]+)")?\s*\)/g)) ids.add(m[2] ?? slug(m[1]));
  for (const m of src.matchAll(/ch\(\s*"([^"]+)"\s*\)/g)) ids.add(slug(m[1]));
}

let problems = 0;
const bad = (where, msg) => {
  problems++;
  console.log(`✗ ${where}: ${msg}`);
};

function checkQuiz(where, src) {
  const blocks = src.trim().split(/\n\s*\n/);
  let n = 0;
  for (const b of blocks) {
    const lines = b.split("\n");
    if (/^W\[\d+\]:/.test(lines[0])) {
      n++;
      if (!lines.some((l) => l.startsWith("A:"))) bad(where, `written question without answer: ${lines[0].slice(0, 60)}`);
      continue;
    }
    if (!/^Q(\[\d+\])?:/.test(lines[0])) continue;
    n++;
    const opts = lines.filter((l) => /^[-*]\s/.test(l));
    const correct = opts.filter((l) => l.startsWith("*")).length;
    if (correct !== 1) bad(where, `${correct} correct options: ${lines[0].slice(0, 70)}`);
    if (opts.length < 3) bad(where, `only ${opts.length} options: ${lines[0].slice(0, 70)}`);
    const texts = opts.map((o) => o.slice(2).trim());
    if (new Set(texts).size !== texts.length) bad(where, `duplicate options: ${lines[0].slice(0, 70)}`);
  }
  return n;
}

let lessons = 0;
for (const dir of readdirSync("src/content/lessons")) {
  for (const f of readdirSync(join("src/content/lessons", dir))) {
    const src = readFileSync(join("src/content/lessons", dir, f), "utf8");
    const parts = src.split(/^===\s*([a-z0-9-]+)\s*===\s*$/m);
    for (let i = 1; i < parts.length; i += 2) {
      const id = parts[i];
      const where = `${dir}/${f}#${id}`;
      lessons++;
      if (!ids.has(id)) bad(where, "id does not match any chapter in the curriculum");
      const [, quiz = ""] = parts[i + 1].split(/^---\s*quiz\s*---\s*$/m);
      const n = checkQuiz(where, quiz);
      if (n < 5) bad(where, `only ${n} quiz questions`);
    }
  }
}
for (const f of readdirSync("src/content/mocks").filter((f) => f.endsWith(".md"))) {
  const src = readFileSync(join("src/content/mocks", f), "utf8");
  for (const sec of src.split(/^##\s+/m).slice(1)) checkQuiz(`mocks/${f}`, sec.slice(sec.indexOf("\n") + 1));
}
console.log(problems ? `\n${problems} problem(s) in ${lessons} lessons` : `✓ ${lessons} lessons and all mocks look good`);
process.exit(problems ? 1 : 0);
