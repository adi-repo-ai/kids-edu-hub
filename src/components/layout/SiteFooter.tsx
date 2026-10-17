import Link from "next/link";
import { Logo } from "./Logo";

const cols = [
  { title: "Learn", links: [["Choose your class", "/#classes"], ["Subjects", "/class/8"], ["Interactive lessons", "/lesson/perfect-squares-as-areas"]] },
  { title: "Practise", links: [["Quizzes & mocks", "/practice"], ["Past papers", "/papers"], ["Notes & worksheets", "/library"]] },
  { title: "Stay on track", links: [["Study planner", "/planner"], ["Parent dashboard", "/parent"], ["CBSE news", "/news"]] },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-surface pb-24 lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-2">Calm, curriculum-aligned learning for CBSE students from Class 1 to 10, built with teachers in India.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="eyebrow mb-3">{c.title}</h2>
            <ul className="space-y-2">
              {c.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-ink-2 hover:text-royal-700 hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-ink-3 sm:px-6 lg:px-8">
          Design preview with illustrative sample content. Kaksha is not affiliated with CBSE or NCERT. Always verify exam notices on cbse.gov.in.
        </p>
      </div>
    </footer>
  );
}
