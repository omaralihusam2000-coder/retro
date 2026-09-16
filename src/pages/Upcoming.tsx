import { Bell, BellRing, Calendar, Gamepad2 } from "lucide-react";
import { upcomingGames } from "../data/upcomingGames";
import { useUserStore } from "../lib/store";
import { useToastStore } from "../lib/toastStore";

export default function Upcoming() {
  const interested = useUserStore((s) => s.interestedUpcoming);
  const toggleInterested = useUserStore((s) => s.toggleInterestedUpcoming);
  const pushToast = useToastStore((s) => s.push);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
        Release Radar
      </p>
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Upcoming games</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-400">
        Announced titles worth keeping an eye on — release windows update as
        studios confirm them, and games marked TBA genuinely have no date yet.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {upcomingGames.map((game) => {
          const isInterested = interested.includes(game.id);
          return (
            <div key={game.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
                    <Gamepad2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">{game.title}</h3>
                    <p className="text-sm text-ink-400">
                      {game.developer}
                      {game.publisher !== game.developer && ` · ${game.publisher}`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleInterested(game.id);
                    pushToast(
                      isInterested
                        ? `Removed ${game.title} from interested`
                        : `We'll flag ${game.title} as interesting to you`,
                    );
                  }}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    isInterested
                      ? "border-accent-500 bg-accent-500/15 text-accent-400"
                      : "border-ink-600 text-ink-300 hover:border-ink-400 hover:text-white"
                  }`}
                >
                  {isInterested ? <BellRing size={14} /> : <Bell size={14} />}
                  {isInterested ? "Interested" : "Notify me"}
                </button>
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-300">
                {game.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {game.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-ink-300"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/5 pt-4 text-xs">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${
                    game.dateConfirmed
                      ? "bg-accent-500/15 text-accent-400"
                      : "bg-white/5 text-ink-300"
                  }`}
                >
                  <Calendar size={12} /> {game.expectedRelease}
                </span>
                <span className="text-ink-400">{game.platforms.join(" · ")}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-ink-500">
        Release windows are the last publicly announced dates and can move —
        we're not affiliated with any of these studios or publishers.
      </p>
    </div>
  );
}
