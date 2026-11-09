import { supabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";
import type { ListStatus, SavedMovie } from "./list-types";

/** Usuário logado, ou null (também null quando o Supabase não está configurado). */
export async function getCurrentUser() {
  if (!supabaseConfigured()) return null;
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/** Em qual lista o filme está para o usuário logado (ou null). */
export async function getMyMovieStatus(
  movieId: number
): Promise<{ signedIn: boolean; status: ListStatus | null }> {
  const user = await getCurrentUser();
  if (!user) return { signedIn: false, status: null };

  const supabase = createClient();
  const { data } = await supabase
    .from("user_movies")
    .select("status")
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .maybeSingle();

  return { signedIn: true, status: (data?.status as ListStatus) ?? null };
}

/** Filmes de uma lista do usuário logado, do mais recente para o mais antigo. */
export async function getSavedMovies(status: ListStatus): Promise<SavedMovie[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_movies")
    .select("movie_id, title, poster_path, release_date, vote_average, status, updated_at")
    .eq("user_id", user.id)
    .eq("status", status)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.movie_id,
    title: row.title,
    poster_path: row.poster_path,
    release_date: row.release_date,
    vote_average: row.vote_average === null ? null : Number(row.vote_average),
    status: row.status as ListStatus,
    updated_at: row.updated_at,
  }));
}
