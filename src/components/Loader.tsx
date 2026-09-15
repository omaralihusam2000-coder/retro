import { Loader2 } from "lucide-react";

export default function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-400">
      <Loader2 className="animate-spin text-neon-500" size={28} />
      <p className="text-sm">{label}…</p>
    </div>
  );
}
