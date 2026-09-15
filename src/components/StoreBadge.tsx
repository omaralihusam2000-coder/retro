import type { StoreKey } from "../lib/types";

const STORE_STYLE: Record<StoreKey | "other", { label: string; className: string }> = {
  steam: { label: "Steam", className: "bg-[#1b2838] text-[#66c0f4] ring-1 ring-[#2a475e]" },
  epic: { label: "Epic Games", className: "bg-[#121212] text-white ring-1 ring-ink-600" },
  gog: { label: "GOG", className: "bg-[#8e2de2]/20 text-[#c9a2ff] ring-1 ring-[#8e2de2]/50" },
  other: { label: "Other Store", className: "bg-ink-700 text-ink-200 ring-1 ring-ink-600" },
};

export default function StoreBadge({
  store,
  size = "md",
}: {
  store: StoreKey | "other";
  size?: "sm" | "md";
}) {
  const style = STORE_STYLE[store];
  return (
    <span
      className={`inline-flex items-center rounded-full font-display font-semibold uppercase tracking-wide ${style.className} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      {style.label}
    </span>
  );
}
