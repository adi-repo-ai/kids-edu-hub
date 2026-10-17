/** Re-mounts on every navigation, giving each page a short 320 ms rise-in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-rise">{children}</div>;
}
