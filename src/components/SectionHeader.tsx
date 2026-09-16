import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function SectionHeader({
  eyebrow,
  title,
  action,
  actionLabel = "See all",
}: {
  eyebrow?: string;
  title: ReactNode;
  action?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-xl font-bold text-ink-100 sm:text-2xl">{title}</h2>
      </div>
      {action && (
        <Link
          to={action}
          className="inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-ink-300 transition hover:text-accent-400"
        >
          {actionLabel} <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
