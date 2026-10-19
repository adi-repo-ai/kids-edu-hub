import { BookOpen, Bookmark, CalendarDays, ClipboardCheck, FileText, Download, House, Layers, LineChart, Newspaper, NotebookPen, Settings, ShoppingBag, Target, Trophy, Users } from "lucide-react";

export const mainNav = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/learn", label: "Learn", icon: BookOpen, match: ["/class"] },
  { href: "/practice", label: "Practice", icon: Target },
  { href: "/mock", label: "Mock tests", icon: ClipboardCheck },
  { href: "/papers", label: "Past papers", icon: FileText },
  { href: "/library", label: "Notes & downloads", icon: Download },
];

export const moreNav = [
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/mistakes", label: "Mistake notebook", icon: NotebookPen },
  { href: "/quests", label: "Quests", icon: Trophy },
  { href: "/shop", label: "Gyani's shop", icon: ShoppingBag },
  { href: "/progress", label: "My progress", icon: LineChart },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/parent", label: "Parent view", icon: Users },
  { href: "/news", label: "CBSE news", icon: Newspaper },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const isActive = (path: string, item: { href: string; match?: string[] }) =>
  [item.href, ...(item.match ?? [])].some((p) => path === p || path.startsWith(p + "/"));
