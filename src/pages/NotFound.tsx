import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center">
      <Gamepad2 size={40} className="mb-4 text-accent-500" />
      <h1 className="font-display text-3xl font-bold text-white">404 — Game Over</h1>
      <p className="mt-2 text-ink-400">This page doesn't exist. Maybe it's still in the backlog.</p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-accent-500 px-5 py-2.5 font-display text-sm font-bold text-ink-950 hover:bg-accent-400"
      >
        Back to home
      </Link>
    </div>
  );
}
