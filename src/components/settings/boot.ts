/**
 * Runs inline in <head> before first paint (see app/layout.tsx): reads the saved settings and sets the same
 * <html> attributes that SettingsSync keeps up to date, so the page never flashes the wrong theme or size.
 * Keep it in step with SettingsSync and modeOf() in lib/store.ts.
 */
export const THEME_COLORS = { light: "#ffffff", dark: "#151c2e" } as const;

/** Print routes (notes, papers) are always light: they double as the PDF source. */
export const PRINT_PATH = /\/(notes|paper)\//;

export const bootScript = `(function(){try{var d=document.documentElement,s={},g=10;
try{var r=JSON.parse(localStorage.getItem("kaksha:v3")||"null");if(r&&r.v===3){s=r.settings||{};if(r.profile&&r.profile.grade)g=r.profile.grade;}}catch(e){}
var t=s.theme==="dark"||s.theme==="light"?s.theme:(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
if(${PRINT_PATH}.test(location.pathname))t="light";
var m=s.mode==="junior"||s.mode==="middle"||s.mode==="senior"?s.mode:(g<=5?"junior":g<=8?"middle":"senior");
d.setAttribute("data-theme",t);d.setAttribute("data-mode",m);
d.setAttribute("data-text",s.textSize||"md");d.setAttribute("data-font",s.font||"default");d.setAttribute("data-spacing",s.spacing||"normal");
d.setAttribute("lang",s.lang==="hi"?"hi":"en-IN");
}catch(e){}})();`;
