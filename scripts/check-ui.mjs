// Clicks through key pages in a real browser and fails on: console errors, horizontal overflow
// (at phone and desktop widths), and buttons that do nothing when clicked.
// Usage: npm run check:ui   (expects a static export in out/; run check:links or STATIC_EXPORT=1 npm run build first)
import { execSync } from "node:child_process";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { extname, join } from "node:path";

const require = createRequire(import.meta.url);
function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    return require(join(execSync("npm root -g").toString().trim(), "playwright"));
  }
}

const OUT = "out";
if (!existsSync(OUT)) {
  console.log("No out/ folder: run `STATIC_EXPORT=1 npm run build` first.");
  process.exit(1);
}
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".txt": "text/plain" };
const server = createServer((req, res) => {
  let p = join(OUT, decodeURIComponent(req.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { "content-type": types[extname(p)] ?? "application/octet-stream" });
  createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(4322, r));
const BASE = "http://localhost:4322";

const PAGES = [
  "/", "/dashboard/", "/learn/", "/class/10/", "/class/10/maths/", "/class/10/maths/real-numbers/", "/class/10/hindi/surdas-ke-pad/",
  "/class/3/", "/class/12/physics/", "/practice/", "/mock/", "/mock/class-10-maths-mock-1/", "/papers/", "/library/",
  "/progress/", "/planner/", "/parent/", "/saved/", "/news/", "/notes/10/maths/real-numbers/", "/paper/class-10-maths-mock-1/",
];
const SEED = { v: 3, profile: { name: "Test", grade: 10, onboarded: true, dailyGoal: 30 }, lessons: { "10/maths/real-numbers": new Date().toISOString() }, quizzes: { "10/maths/real-numbers": { best: 8, total: 10, attempts: 1, last: new Date().toISOString() } }, mocks: [], bookmarks: [{ key: "10/maths/polynomials", title: "Polynomials", meta: "Class 10 · Maths", href: "/class/10/maths/polynomials" }], tasks: [{ id: "t1", title: "Revise", date: new Date().toISOString().slice(0, 10), minutes: 30, done: false }], activity: {}, xp: 120 };

const { chromium } = loadPlaywright();
const browser = await chromium.launch({ args: ["--no-proxy-server"] });
const problems = [];
const fail = (msg) => {
  problems.push(msg);
  console.log(`✗ ${msg}`);
};

async function fresh(ctx, path) {
  const page = await ctx.newPage();
  page.on("dialog", (d) => d.accept());
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  return page;
}

for (const [label, viewport] of [["phone", { width: 390, height: 844 }], ["desktop", { width: 1280, height: 900 }]]) {
  const ctx = await browser.newContext({ viewport, acceptDownloads: true });
  await ctx.addInitScript((seed) => {
    window.print = () => document.body.setAttribute("data-printed", String(Date.now()));
    if (!localStorage.getItem("kaksha:v3")) localStorage.setItem("kaksha:v3", JSON.stringify(seed));
  }, SEED);
  for (const path of PAGES) {
    const page = await fresh(ctx, path);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.reload({ waitUntil: "networkidle" });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (over > 1) fail(`[${label}] ${path}: page is ${over}px wider than the screen`);
    for (const e of errors) fail(`[${label}] ${path}: console error: ${e.slice(0, 160)}`);

    const count = await page.locator("button:visible:not([disabled]):not([aria-selected=true]):not([aria-pressed=true])").count();
    await page.close();
    for (let i = 0; i < count; i++) {
      const p = await fresh(ctx, path);
      const btn = p.locator("button:visible:not([disabled]):not([aria-selected=true]):not([aria-pressed=true])").nth(i);
      if (!(await btn.count())) {
        await p.close();
        continue;
      }
      const name = ((await btn.getAttribute("aria-label")) || (await btn.innerText()).trim() || "(icon)").slice(0, 40);
      await p.evaluate(() => {
        window.__changed = false;
        new MutationObserver(() => (window.__changed = true)).observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
      });
      const url = p.url();
      let effect = false;
      p.once("download", () => (effect = true));
      p.once("popup", () => (effect = true));
      try {
        await btn.click({ timeout: 2000 });
        await p.waitForTimeout(350);
        effect ||= p.url() !== url || (await p.evaluate(() => window.__changed).catch(() => true));
      } catch (e) {
        fail(`[${label}] ${path}: button "${name}" could not be clicked (${e.message.split("\n")[0]})`);
        effect = true;
      }
      if (!effect) fail(`[${label}] ${path}: button "${name}" does nothing`);
      await p.close();
    }
    console.log(`  ${label} ${path}: ${count} buttons`);
  }
  await ctx.close();
}

await browser.close();
server.close();
if (problems.length) {
  console.log(`\n${problems.length} UI problems`);
  process.exit(1);
}
console.log("✓ No console errors, no sideways scroll, every button does something");
