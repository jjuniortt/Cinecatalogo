import type {
  Genre,
  Movie,
  MovieDetails,
  TMDBListResponse,
} from "./types";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

/** Netflix no TMDB. Catálogo filtrado por este provedor + região Brasil. */
export const NETFLIX_PROVIDER_ID = 8;
export const WATCH_REGION = "BR";
export const LANGUAGE = "pt-BR";

export class TMDBConfigError extends Error {}

function auth(): { headers: Record<string, string>; apiKey?: string } {
  const token = process.env.TMDB_ACCESS_TOKEN?.trim();
  const apiKey = process.env.TMDB_API_KEY?.trim();
  if (token) {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  if (apiKey) {
    return { headers: {}, apiKey };
  }
  throw new TMDBConfigError(
    "Credenciais do TMDB ausentes. Preencha TMDB_ACCESS_TOKEN ou TMDB_API_KEY em .env.local."
  );
}

export function hasCredentials(): boolean {
  return Boolean(
    process.env.TMDB_ACCESS_TOKEN?.trim() || process.env.TMDB_API_KEY?.trim()
  );
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const { headers, apiKey } = auth();
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("language", LANGUAGE);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  if (apiKey) url.searchParams.set("api_key", apiKey);

  const res = await fetch(url.toString(), {
    headers: { accept: "application/json", ...headers },
    // Cache de 1h — catálogo não muda a cada request.
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`TMDB ${res.status} em ${path}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

/** Monta a URL de uma imagem do TMDB. */
export function imageUrl(
  path: string | null,
  size: "w185" | "w300" | "w500" | "w780" | "w1280" | "original" = "w500"
): string | null {
  if (!path) return null;
  return `${IMG_BASE}/${size}${path}`;
}

export interface DiscoverOptions {
  sortBy?: string;
  genreId?: number;
  minVotes?: number;
  /** Nota mínima (vote_average). Quando definido, filtra por avaliação. */
  minRating?: number;
  page?: number;
}

/** Notas oferecidas como botões de filtro na home. */
export const RATING_FILTERS = [7, 8, 9] as const;

/**
 * Traduz o valor cru do parâmetro `?nota=` da URL numa nota válida.
 * Só os valores dos botões (7, 8, 9) contam; qualquer outra coisa vira null
 * (ou seja, "sem filtro").
 */
export function parseRatingFilter(
  raw: string | undefined | null
): number | null {
  if (raw == null) return null;
  const n = Number(raw);
  return (RATING_FILTERS as readonly number[]).includes(n) ? n : null;
}

/** Monta os parâmetros da chamada /discover/movie a partir das opções. */
export function discoverParams(
  options: DiscoverOptions
): Record<string, string | number | boolean | undefined> {
  return {
    watch_region: WATCH_REGION,
    with_watch_providers: NETFLIX_PROVIDER_ID,
    with_watch_monetization_types: "flatrate",
    include_adult: false,
    sort_by: options.sortBy ?? "popularity.desc",
    with_genres: options.genreId,
    "vote_count.gte": options.minVotes,
    "vote_average.gte": options.minRating,
    page: options.page ?? 1,
  };
}

/** Descobre filmes disponíveis na Netflix (BR), com ordenação/gênero opcionais. */
export async function discoverNetflix(options: DiscoverOptions): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBListResponse>(
    "/discover/movie",
    discoverParams(options)
  );
  return data.results;
}

export async function getGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>("/genre/movie/list");
  return data.genres;
}

export async function getMovie(id: number | string): Promise<MovieDetails> {
  return tmdbFetch<MovieDetails>(`/movie/${id}`, {
    append_to_response: "credits,videos,watch/providers",
  });
}

export async function searchMovies(
  query: string,
  page = 1
): Promise<TMDBListResponse> {
  return tmdbFetch<TMDBListResponse>("/search/movie", {
    query,
    include_adult: false,
    page,
  });
}
