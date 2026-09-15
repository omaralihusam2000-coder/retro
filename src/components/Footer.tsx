import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-ink-400">
              Track what you play, rate and review it, and find the best real
              deals across Steam, Epic Games and GOG — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <p className="mb-2 font-display font-semibold text-ink-200">Browse</p>
              <ul className="space-y-1.5 text-ink-400">
                <li><Link to="/games" className="hover:text-neon-400">All Games</Link></li>
                <li><Link to="/deals" className="hover:text-neon-400">Live Deals</Link></li>
                <li><Link to="/activity" className="hover:text-neon-400">Activity</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-display font-semibold text-ink-200">You</p>
              <ul className="space-y-1.5 text-ink-400">
                <li><Link to="/profile" className="hover:text-neon-400">Profile</Link></li>
                <li><Link to="/lists" className="hover:text-neon-400">Your Lists</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-display font-semibold text-ink-200">Stores</p>
              <ul className="space-y-1.5 text-ink-400">
                <li><a href="https://store.steampowered.com" target="_blank" rel="noopener noreferrer" className="hover:text-neon-400">Steam</a></li>
                <li><a href="https://store.epicgames.com" target="_blank" rel="noopener noreferrer" className="hover:text-neon-400">Epic Games</a></li>
                <li><a href="https://www.gog.com" target="_blank" rel="noopener noreferrer" className="hover:text-neon-400">GOG</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-ink-800 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Built for people who take their backlog too seriously.</p>
          <p>Deal prices link out to third-party storefronts and can change at any time.</p>
        </div>
      </div>
    </footer>
  );
}
