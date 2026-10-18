import type { ChapterDef, SubjectDef, UnitDef } from "@/lib/types";

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Chapter. Pass an explicit id for non-Latin titles. */
export const ch = (title: string, topics: string[] = [], id?: string): ChapterDef => ({ id: id ?? slug(title), title, topics });
export const unit = (title: string, chapters: ChapterDef[]): UnitDef => ({ title, chapters });
export const subject = (id: string, name: string, books: string[], units: UnitDef[]): SubjectDef => ({ id, name, books, units });
