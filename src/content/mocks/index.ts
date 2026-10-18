export interface MockDef {
  id: string;
  title: string;
  grade: number;
  subject: string;
  minutes: number;
  marks: number;
  /** Markdown file under src/content/mocks with "## Section …" headings. */
  file: string;
  pattern: string;
}

export const mocks: MockDef[] = [];
