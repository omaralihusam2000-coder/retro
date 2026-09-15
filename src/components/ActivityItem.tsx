import { Link } from "react-router-dom";
import type { ActivityEntry } from "../lib/types";
import { getGameById } from "../lib/gamesData";
import { timeAgo } from "../lib/format";
import Avatar from "./Avatar";
import PosterImage from "./PosterImage";
import StarRating from "./StarRating";

const ACTION_TEXT: Record<ActivityEntry["action"], string> = {
  logged: "logged",
  reviewed: "reviewed",
  listed: "added to a list",
  rated: "rated",
  wishlisted: "wishlisted",
};

export default function ActivityItem({ entry }: { entry: ActivityEntry }) {
  const game = getGameById(entry.gameId);
  if (!game) return null;

  return (
    <div className="flex gap-3 border-b border-ink-800 py-4 last:border-0">
      <Avatar seed={entry.avatarSeed} />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink-200">
          <span className="font-semibold text-ink-100">{entry.username}</span>{" "}
          {ACTION_TEXT[entry.action]}{" "}
          <Link to={`/games/${game.slug}`} className="font-semibold text-neon-400 hover:underline">
            {game.title}
          </Link>
          {entry.action === "listed" && entry.listName && (
            <>
              {" "}
              &mdash; <span className="italic text-ink-300">{entry.listName}</span>
            </>
          )}
        </p>
        {typeof entry.rating === "number" && (
          <div className="mt-1">
            <StarRating value={entry.rating} readOnly size={13} />
          </div>
        )}
        {entry.reviewSnippet && (
          <p className="mt-1.5 text-sm leading-relaxed text-ink-300">“{entry.reviewSnippet}”</p>
        )}
        <p className="mt-1.5 text-xs text-ink-400">{timeAgo(entry.timestamp)}</p>
      </div>
      <Link to={`/games/${game.slug}`} className="h-16 w-11 shrink-0 overflow-hidden rounded-md">
        <PosterImage src={game.cover} title={game.title} />
      </Link>
    </div>
  );
}
