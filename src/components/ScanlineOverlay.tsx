import { useRetroStore } from "../lib/retroStore";

export default function ScanlineOverlay() {
  const scanlinesOn = useRetroStore((s) => s.scanlinesOn);
  if (!scanlinesOn) return null;
  return <div className="crt-scanlines" aria-hidden="true" />;
}
