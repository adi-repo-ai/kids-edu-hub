import { Tag } from "../ui/Tag";

export function ChapterStatus({ progress }: { progress: number }) {
  if (progress >= 100) return <Tag hue="mint">Completed</Tag>;
  if (progress > 0) return <Tag hue="sun">In progress</Tag>;
  return <Tag>Not started</Tag>;
}
