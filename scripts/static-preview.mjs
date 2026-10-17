// Turns the STATIC_EXPORT build in out/ into a self-contained preview in preview/
// that works from any URL prefix: every asset path is made relative, chunk loading
// is pointed at a runtime-computed base, and internal links become full-page loads.
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const NEXT = "/_next/";
const OUT = "out";
const DEST = "preview";
const APP = join(DEST, "app");

if (!existsSync(OUT)) throw new Error("Run `STATIC_EXPORT=1 next build` first.");
rmSync(DEST, { recursive: true, force: true });
cpSync(OUT, APP, { recursive: true });

// Not needed without client-side routing.
for (const dir of ["_not-found", "404"]) rmSync(join(APP, dir), { recursive: true, force: true });
rmSync(join(APP, "404.html"), { force: true });

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));

const shim = (rel) => `<script>(function(){
var R=new URL(${JSON.stringify(rel || "./")},location.href).href;
// Must equal the rewritten src attributes exactly: Turbopack finds loaded chunks via script[src="base+path"].
var B=${JSON.stringify(rel + "_next/")};
window.TURBOPACK_CHUNK_BASE_PATH=B;
var P=${JSON.stringify(NEXT)};
function fix(v){return typeof v==="string"?v.split(P).join(B):Array.isArray(v)?v.map(fix):v;}
var q=[],inner=Array.prototype.push.bind(q);
Object.defineProperty(q,"push",{configurable:true,get:function(){return function(){return inner.apply(null,Array.prototype.map.call(arguments,fix));};},set:function(f){inner=f;}});
self.__next_f=q;
function to(h){var u=new URL(h,"https://x.invalid");var p=u.pathname.replace(/^\\//,"");if(p&&p.slice(-1)!=="/")p+="/";return R+p+"index.html"+u.search+u.hash;}
window.__kakshaBase=new URL(R).pathname;
// Link prefetches ask for server routes that don't exist here; fail them locally.
var f=window.fetch;window.fetch=function(i,o){var u=new URL(typeof i==="string"?i:i.url||String(i),location.href);
if(u.origin===location.origin&&u.pathname.indexOf(window.__kakshaBase)!==0)return Promise.reject(new TypeError("Not available in static preview"));return f.apply(this,arguments);};
window.__kakshaGo=function(h){location.assign(to(h));};
window.addEventListener("click",function(e){
  var a=e.target&&e.target.closest&&e.target.closest("a[href^='/']");
  if(!a||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  e.preventDefault();e.stopPropagation();location.assign(to(a.getAttribute("href")));
},true);
})();</script>`;

let pages = 0;
for (const file of walk(APP)) {
  if (file.endsWith(".txt")) {
    rmSync(file);
    continue;
  }
  if (!file.endsWith(".html")) continue;
  const depth = relative(APP, file).split(sep).length - 1;
  const rel = "../".repeat(depth);
  let html = readFileSync(file, "utf8");
  // Attributes become relative; the shim rewrites the inline RSC payload's /_next/ URLs
  // to the same relative form as it is pushed.
  html = html.split(`src="${NEXT}`).join(`src="${rel}_next/`).split(`href="${NEXT}`).join(`href="${rel}_next/`);
  html = html.replace("<head>", "<head>" + shim(rel));
  writeFileSync(file, html);
  pages++;
}

// Some hosts reject literal U+FFFD in uploads; the escape is equivalent inside JS strings.
for (const file of walk(join(APP, "_next"))) {
  if (!file.endsWith(".js")) continue;
  const src = readFileSync(file, "utf8");
  if (src.includes("\uFFFD")) writeFileSync(file, src.split("\uFFFD").join("\\ufffd"));
}

writeFileSync(
  join(DEST, "index.html"),
  `<title>Kaksha</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
:root{--bg:#fffbf3;--fg:#1a1d3a;--muted:#474b66;--accent:#2338b0}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#14162b;--fg:#f3f1ea;--muted:#b9bbcc;--accent:#bcc7ff;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#14162b;--fg:#f3f1ea;--muted:#b9bbcc;--accent:#bcc7ff;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:48px}
a{color:var(--accent);font-weight:600}
p{color:var(--muted)}
</style>
<h1>Kaksha</h1>
<p>Opening the CBSE learning portal preview… If nothing happens, <a href="app/index.html">open it here</a>.</p>
<script>location.replace("app/index.html");</script>
`,
);

console.log(`Preview ready in ${DEST}/ (${pages} pages, ${walk(DEST).length} files)`);
