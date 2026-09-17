import { useState } from "react";
import { Gamepad2 } from "lucide-react";

function hashHue(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i);
  return Math.abs(hash) % 360;
}

export default function PosterImage({
  src,
  title,
  className = "",
}: {
  src: string;
  title: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    const hue = hashHue(title);
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center ${className}`}
        style={{
          background: `linear-gradient(150deg, hsl(${hue} 45% 16%), hsl(${(hue + 40) % 360} 55% 10%))`,
        }}
      >
        <Gamepad2 className="text-white/40" size={18} />
        <span className="line-clamp-3 font-display text-[10px] font-semibold leading-tight text-white/70">
          {title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
