// Generates the downloadable PDFs (chapter notes + practice papers) into public/.
// Usage: npm run pdfs   (needs Playwright with Chromium installed locally)
// The PDFs are committed, so the deployed site serves them as plain static files.
import { execSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { extname, join } from "node:path";

const require = createRequire(import.meta.url);
function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    const globalRoot = execSync("npm root -g").toString().trim();
    return require(join(globalRoot, "playwright"));
  }
}

const OUT = "out";
console.log("Building static export…");
execSync("npx next build", { stdio: "inherit", env: { ...process.env, STATIC_EXPORT: "1", NEXT_TELEMETRY_DISABLED: "1" } });

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
await new Promise((r) => server.listen(4321, r));

const walk = (dir) => (existsSync(dir) ? readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)])) : []);
const jobs = [];
for (const f of walk(join(OUT, "notes"))) {
  const m = f.match(/notes\/(\d+)\/([^/]+)\/([^/]+)\/index\.html$/);
  if (m) jobs.push({ url: `/notes/${m[1]}/${m[2]}/${m[3]}/`, file: `public/notes/${m[1]}-${m[2]}-${m[3]}.pdf` });
}
for (const f of walk(join(OUT, "paper"))) {
  const m = f.match(/paper\/([^/]+)\/index\.html$/);
  if (m) jobs.push({ url: `/paper/${m[1]}/`, file: `public/papers/${m[1]}.pdf` });
}
mkdirSync("public/notes", { recursive: true });
mkdirSync("public/papers", { recursive: true });

const { chromium } = loadPlaywright();
const browser = await chromium.launch({ args: ["--no-proxy-server"] });
const page = await browser.newPage();
let n = 0;
for (const job of jobs) {
  await page.goto(`http://localhost:4321${job.url}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: job.file,
    format: "A4",
    printBackground: true,
    margin: { top: "14mm", bottom: "16mm", left: "12mm", right: "12mm" },
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: '<div style="width:100%;font-size:8px;color:#64748b;text-align:center;font-family:sans-serif">Kaksha · free CBSE learning · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
  });
  if (++n % 25 === 0) console.log(`${n}/${jobs.length} PDFs`);
}
await browser.close();
server.close();
console.log(`Done: ${n} PDFs written to public/notes and public/papers.`);
