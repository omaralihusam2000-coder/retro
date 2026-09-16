import { avatarGradient, avatarTextColor, initials } from "../data/activityMock";

export default function Avatar({
  seed,
  size = 36,
}: {
  seed: string;
  size?: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-display font-bold"
      style={{
        width: size,
        height: size,
        background: avatarGradient(seed),
        color: avatarTextColor(seed),
        fontSize: size * 0.36,
      }}
    >
      {initials(seed)}
    </div>
  );
}
