import { Gamepad2 } from "lucide-react";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-display font-bold tracking-wide">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 text-ink-950 shadow-glow-accent">
        <Gamepad2 size={18} strokeWidth={2.5} />
      </span>
      {!compact && (
        <span className="text-xl text-white">
          RETRO<span className="text-accent-500">.</span>
        </span>
      )}
    </span>
  );
}
