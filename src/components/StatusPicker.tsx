import { BookmarkPlus, CheckCircle2, CircleDashed, Heart, PlayCircle } from "lucide-react";
import type { LogStatus } from "../lib/types";

const OPTIONS: { key: LogStatus; label: string; icon: typeof PlayCircle }[] = [
  { key: "backlog", label: "Backlog", icon: BookmarkPlus },
  { key: "playing", label: "Playing", icon: PlayCircle },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "abandoned", label: "Abandoned", icon: CircleDashed },
];

export default function StatusPicker({
  value,
  onChange,
}: {
  value?: LogStatus;
  onChange: (status: LogStatus | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map(({ key, label, icon: Icon }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(active ? undefined : key)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? "border-accent-500 bg-accent-500/15 text-accent-400"
                : "border-ink-600 text-ink-300 hover:border-ink-400 hover:text-ink-100"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
