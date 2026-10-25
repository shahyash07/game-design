import { supabase } from "@/integrations/supabase/client";
import { today } from "./progress";

export interface BoardRow { user_id: string; score: number; ms: number; name: string; avatar: string }

export async function submitDailyScore(game: string, score: number, ms: number) {
  const { error } = await supabase.rpc("submit_daily_score", { _game: game, _day: today(), _score: Math.max(0, Math.round(score)), _ms: Math.round(ms) });
  if (error) throw error;
}

export async function fetchBoard(game: string, day = today(), limit = 25): Promise<BoardRow[]> {
  const { data: scores, error } = await supabase.from("daily_scores").select("user_id, score, ms")
    .eq("game", game).eq("day", day).order("score", { ascending: false }).order("ms", { ascending: true }).limit(limit);
  if (error) throw error;
  const ids = (scores ?? []).map((s) => s.user_id);
  const { data: profiles } = ids.length ? await supabase.from("profiles").select("id, display_name, avatar").in("id", ids) : { data: [] };
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  return (scores ?? []).map((s) => ({ ...s, name: byId.get(s.user_id)?.display_name ?? "Player", avatar: byId.get(s.user_id)?.avatar ?? "🧠" }));
}

/** 1-based rank of a user for a game today, plus total players. */
export async function fetchMyRank(game: string, userId: string, day = today()) {
  const { data: mine } = await supabase.from("daily_scores").select("score, ms").eq("game", game).eq("day", day).eq("user_id", userId).maybeSingle();
  const { count: total } = await supabase.from("daily_scores").select("*", { count: "exact", head: true }).eq("game", game).eq("day", day);
  if (!mine) return { rank: null, total: total ?? 0, best: null };
  const { count: above } = await supabase.from("daily_scores").select("*", { count: "exact", head: true }).eq("game", game).eq("day", day)
    .or(`score.gt.${mine.score},and(score.eq.${mine.score},ms.lt.${mine.ms})`);
  return { rank: (above ?? 0) + 1, total: total ?? 0, best: mine.score };
}
