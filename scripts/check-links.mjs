// Verifies every internal href/src in the static export resolves to a generated page or file.
// Usage: npm run check:links   (pass --no-build to reuse an existing out/)
import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
if (!process.argv.includes("--no-build")) {
  execSync("npx next build", { stdio: "inherit", env: { ...process.env, STATIC_EXPORT: "1", BASE_PATH: "", NEXT_TELEMETRY_DISABLED: "1" } });
}

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const pages = walk(OUT).filter((f) => f.endsWith(".html"));

const resolves = (url) => {
  const p = decodeURIComponent(url.split(/[?#]/)[0]);
  if (p === "" || p === "/") return true;
  const f = join(OUT, p);
  if (existsSync(f) && statSync(f).isFile()) return true;
  return existsSync(join(f, "index.html")) || existsSync(`${f}.html`) || (existsSync(join("public", p)) && statSync(join("public", p)).isFile());
};

const broken = new Map();
let checked = 0;
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  for (const m of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    const url = m[1].replace(/&amp;/g, "&");
    if (url.startsWith("//") || url.startsWith("/_next/")) continue;
    checked++;
    if (!resolves(url)) {
      if (!broken.has(url)) broken.set(url, new Set());
      broken.get(url).add(page.slice(OUT.length));
    }
  }
}

if (broken.size) {
  for (const [url, from] of broken) console.log(`✗ ${url}  (linked from ${[...from].slice(0, 3).join(", ")}${from.size > 3 ? ` +${from.size - 3} more` : ""})`);
  console.log(`\n${broken.size} broken internal links across ${pages.length} pages`);
  process.exit(1);
}
console.log(`✓ ${checked.toLocaleString()} internal links on ${pages.length} pages all resolve`);
