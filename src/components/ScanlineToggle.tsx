import { Tv, TvMinimal } from "lucide-react";
import { useRetroStore } from "../lib/retroStore";

export default function ScanlineToggle() {
  const scanlinesOn = useRetroStore((s) => s.scanlinesOn);
  const toggleScanlines = useRetroStore((s) => s.toggleScanlines);

  return (
    <button
      type="button"
      onClick={toggleScanlines}
      title={scanlinesOn ? "Turn off CRT scanlines" : "Turn on CRT scanlines"}
      aria-pressed={scanlinesOn}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition ${
        scanlinesOn
          ? "border-accent-500/50 text-accent-400 shadow-glow-accent"
          : "border-ink-600 text-ink-400 hover:border-ink-400 hover:text-ink-100"
      }`}
    >
      {scanlinesOn ? <Tv size={16} /> : <TvMinimal size={16} />}
    </button>
  );
}
