import { avatarGradient, initials } from "../data/activityMock";

export default function Avatar({
  seed,
  size = 36,
}: {
  seed: string;
  size?: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white/90"
      style={{
        width: size,
        height: size,
        background: avatarGradient(seed),
        fontSize: size * 0.36,
      }}
    >
      {initials(seed)}
    </div>
  );
}
