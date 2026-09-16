import { useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Search, Tag, X } from "lucide-react";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { useUserStore } from "../lib/store";

const LINKS = [
  { to: "/games", label: "Games" },
  { to: "/upcoming", label: "Upcoming" },
  { to: "/deals", label: "Deals" },
  { to: "/activity", label: "Activity" },
  { to: "/lists", label: "Lists" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const handle = useUserStore((s) => s.handle);

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  }

  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 font-display text-sm font-semibold transition ${
                  isActive
                    ? "text-accent-400"
                    : "text-ink-300 hover:text-ink-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-xs flex-1 md:flex">
          <div className="relative w-full">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games…"
              className="w-full rounded-full border border-ink-700 bg-ink-800 py-2 pl-9 pr-3 text-sm text-ink-100 outline-none transition placeholder:text-ink-400 focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20"
            />
          </div>
        </form>

        <Link
          to="/deals"
          className="hidden shrink-0 items-center gap-1.5 rounded-full bg-accent-500/10 px-3 py-1.5 text-xs font-bold text-accent-400 ring-1 ring-accent-500/30 transition hover:bg-accent-500/20 sm:inline-flex"
        >
          <Tag size={13} /> Live Deals
        </Link>

        <Link to={`/profile`} className="hidden shrink-0 md:block">
          <Avatar seed={handle} size={34} />
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto rounded-lg p-2 text-ink-200 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-800 px-4 pb-4 pt-2 md:hidden">
          <form onSubmit={submitSearch} className="mb-3">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search games…"
                className="w-full rounded-full border border-ink-700 bg-ink-800 py-2 pl-9 pr-3 text-sm text-ink-100 outline-none"
              />
            </div>
          </form>
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 font-display text-sm font-semibold ${
                    isActive ? "bg-ink-800 text-accent-400" : "text-ink-300"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/profile"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 font-display text-sm font-semibold text-ink-300"
            >
              Profile
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
