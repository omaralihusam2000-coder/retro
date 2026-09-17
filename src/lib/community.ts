import { supabase } from "./supabaseClient";
import { getDeviceId } from "./deviceId";
import type { GameComment, Suggestion, SuggestionInput } from "./types";

const LS_SUGGESTIONS = "retro-suggestions-v1";
const LS_VOTES = "retro-suggestion-votes-v1";
const LS_COMMENTS = "retro-comments-v1";
const LS_PLAYED = "retro-played-v1";

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable or full — non-critical, data just won't persist */
  }
}

interface SuggestionRow {
  id: string;
  title: string;
  release_year: number | null;
  platform: string | null;
  cover_url: string | null;
  video_url: string | null;
  reason: string;
  submitted_by: string | null;
  status: Suggestion["status"];
  created_at: string;
  votes: number | null;
}

function fromRow(row: SuggestionRow): Suggestion {
  return {
    id: row.id,
    title: row.title,
    releaseYear: row.release_year ?? undefined,
    platform: row.platform ?? "",
    coverUrl: row.cover_url ?? undefined,
    videoUrl: row.video_url ?? undefined,
    reason: row.reason,
    submittedBy: row.submitted_by ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    votes: row.votes ?? 0,
  };
}

export async function fetchSuggestions(): Promise<Suggestion[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("suggestions_with_votes")
      .select("*")
      .order("votes", { ascending: false });
    if (!error && data) return (data as SuggestionRow[]).map(fromRow);
  }
  return readLocal<Suggestion[]>(LS_SUGGESTIONS, []).sort((a, b) => b.votes - a.votes);
}

export async function submitSuggestion(input: SuggestionInput): Promise<void> {
  const submittedBy = input.submittedBy?.trim() || "Anonymous";
  if (supabase) {
    const { error } = await supabase.from("suggestions").insert({
      title: input.title,
      release_year: input.releaseYear ?? null,
      platform: input.platform,
      cover_url: input.coverUrl || null,
      video_url: input.videoUrl || null,
      reason: input.reason,
      submitted_by: submittedBy,
    });
    if (!error) return;
  }
  const suggestions = readLocal<Suggestion[]>(LS_SUGGESTIONS, []);
  suggestions.unshift({
    ...input,
    submittedBy,
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    votes: 0,
  });
  writeLocal(LS_SUGGESTIONS, suggestions);
}

export function hasVotedLocally(suggestionId: string): boolean {
  return Boolean(readLocal<Record<string, boolean>>(LS_VOTES, {})[suggestionId]);
}

function rememberVoteLocally(suggestionId: string) {
  const votes = readLocal<Record<string, boolean>>(LS_VOTES, {});
  votes[suggestionId] = true;
  writeLocal(LS_VOTES, votes);
}

export async function upvoteSuggestion(suggestionId: string): Promise<void> {
  if (hasVotedLocally(suggestionId)) return;
  rememberVoteLocally(suggestionId);

  if (supabase && !suggestionId.startsWith("local-")) {
    const { error } = await supabase
      .from("suggestion_votes")
      .insert({ suggestion_id: suggestionId, voter_id: getDeviceId() });
    if (!error) return;
  }

  const suggestions = readLocal<Suggestion[]>(LS_SUGGESTIONS, []);
  writeLocal(
    LS_SUGGESTIONS,
    suggestions.map((s) => (s.id === suggestionId ? { ...s, votes: s.votes + 1 } : s)),
  );
}

interface CommentRow {
  id: string;
  game_id: string;
  author_name: string;
  body: string;
  created_at: string;
}

function commentFromRow(row: CommentRow): GameComment {
  return {
    id: row.id,
    gameId: row.game_id,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
  };
}

export async function fetchComments(gameId: string): Promise<GameComment[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("game_id", gameId)
      .order("created_at", { ascending: false });
    if (!error && data) return (data as CommentRow[]).map(commentFromRow);
  }
  return readLocal<Record<string, GameComment[]>>(LS_COMMENTS, {})[gameId] ?? [];
}

export async function addComment(
  gameId: string,
  body: string,
  authorName: string,
): Promise<GameComment> {
  const name = authorName.trim() || "Anonymous";
  if (supabase) {
    const { data, error } = await supabase
      .from("comments")
      .insert({ game_id: gameId, body, author_name: name })
      .select()
      .single();
    if (!error && data) return commentFromRow(data as CommentRow);
  }
  const comment: GameComment = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    gameId,
    authorName: name,
    body,
    createdAt: new Date().toISOString(),
  };
  const all = readLocal<Record<string, GameComment[]>>(LS_COMMENTS, {});
  all[gameId] = [comment, ...(all[gameId] ?? [])];
  writeLocal(LS_COMMENTS, all);
  return comment;
}

export function hasPlayedLocally(gameId: string): boolean {
  return Boolean(readLocal<Record<string, boolean>>(LS_PLAYED, {})[gameId]);
}

export async function fetchPlayedCount(gameId: string): Promise<number | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("played_counts")
    .select("played_count")
    .eq("game_id", gameId)
    .maybeSingle();
  if (error || !data) return null;
  return (data as { played_count: number }).played_count;
}

export async function markPlayed(gameId: string): Promise<void> {
  const played = readLocal<Record<string, boolean>>(LS_PLAYED, {});
  played[gameId] = true;
  writeLocal(LS_PLAYED, played);
  if (supabase) {
    await supabase.from("played_games").insert({ game_id: gameId, player_id: getDeviceId() });
  }
}

export async function unmarkPlayed(gameId: string): Promise<void> {
  const played = readLocal<Record<string, boolean>>(LS_PLAYED, {});
  delete played[gameId];
  writeLocal(LS_PLAYED, played);
  if (supabase) {
    await supabase.from("played_games").delete().eq("game_id", gameId).eq("player_id", getDeviceId());
  }
}
