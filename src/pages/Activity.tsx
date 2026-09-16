import { activityFeed } from "../data/activityMock";
import ActivityItem from "../components/ActivityItem";

export default function Activity() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">Community</p>
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Activity</h1>
      <p className="mt-2 text-sm text-ink-400">
        What the rest of Retro has been logging, rating and adding to lists.
      </p>
      <div className="mt-8 glass rounded-2xl px-4">
        {activityFeed.map((entry) => (
          <ActivityItem key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
