import { Gamepad2 } from "lucide-react";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-display font-bold tracking-wide">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-500 to-cyan-500 text-ink-950 shadow-glow-neon">
        <Gamepad2 size={18} strokeWidth={2.5} />
      </span>
      {!compact && (
        <span className="text-xl text-ink-100">
          RETRO<span className="text-neon-500">.</span>
        </span>
      )}
    </span>
  );
}
