"use server";

import { revalidatePath } from "next/cache";
import type { ListStatus, MoviePreview } from "@/lib/list-types";
import { createClient } from "@/lib/supabase/server";

export type SetStatusResult =
  | { ok: true; status: ListStatus | null }
  | { ok: false; error: string };

/**
 * Coloca o filme em uma lista, ou remove da lista quando `status` é null.
 * Como a chave é (usuário, filme), marcar "já assisti" troca a lista do filme.
 */
export async function setMovieStatus(
  movie: MoviePreview,
  status: ListStatus | null
): Promise<SetStatusResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Entre na sua conta para salvar filmes." };
  }

  const { error } =
    status === null
      ? await supabase
          .from("user_movies")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movie.id)
      : await supabase.from("user_movies").upsert(
          {
            user_id: user.id,
            movie_id: movie.id,
            status,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,movie_id" }
        );

  if (error) {
    return { ok: false, error: "Não foi possível salvar. Tente de novo." };
  }

  revalidatePath("/");
  revalidatePath(`/filme/${movie.id}`);
  return { ok: true, status };
}
