/** Print-friendly pages (notes and question papers) without the app chrome; also the source for PDF downloads. */
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-white">{children}</div>;
}
