import { useState, type MouseEvent } from "react";
import { Star } from "lucide-react";
import { clamp } from "../lib/format";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
  showValue?: boolean;
}

export default function StarRating({
  value,
  onChange,
  size = 18,
  readOnly = false,
  showValue = false,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const interactive = !readOnly && !!onChange;
  const display = hover ?? value;

  function handlePick(index: number, e: MouseEvent<HTMLButtonElement>) {
    if (!interactive || !onChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - rect.left < rect.width / 2;
    const next = clamp(index + (isHalf ? 0.5 : 1), 0.5, 5);
    onChange(next === value ? 0 : next);
  }

  function handleHover(index: number, e: MouseEvent<HTMLButtonElement>) {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - rect.left < rect.width / 2;
    setHover(clamp(index + (isHalf ? 0.5 : 1), 0.5, 5));
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className="inline-flex items-center"
        onMouseLeave={() => interactive && setHover(null)}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const fillFraction = clamp(display - i, 0, 1);
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={(e) => handlePick(i, e)}
              onMouseMove={(e) => handleHover(i, e)}
              className={`relative ${interactive ? "cursor-pointer" : "cursor-default"}`}
              style={{ width: size, height: size }}
              aria-label={`Rate ${i + 1} stars`}
            >
              <Star
                size={size}
                strokeWidth={1.5}
                className="absolute inset-0 text-ink-500"
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillFraction * 100}%` }}
              >
                <Star size={size} strokeWidth={1.5} className="fill-amber-400 text-amber-400" />
              </span>
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-ink-200">
          {value > 0 ? value.toFixed(1) : "—"}
        </span>
      )}
    </div>
  );
}
