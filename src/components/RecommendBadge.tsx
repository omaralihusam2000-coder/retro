import { ThumbsDown, ThumbsUp } from "lucide-react";

export default function RecommendBadge({ recommend }: { recommend: boolean | undefined }) {
  if (recommend === undefined) return null;
  return recommend ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent-500/15 px-2 py-0.5 text-[11px] font-semibold text-accent-400">
      <ThumbsUp size={11} /> Recommended
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-ink-200">
      <ThumbsDown size={11} /> Not recommended
    </span>
  );
}
