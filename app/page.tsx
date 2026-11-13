import Hero from "@/components/Hero";
import ListTabs from "@/components/ListTabs";
import RatingFilter from "@/components/RatingFilter";
import Row from "@/components/Row";
import SavedList from "@/components/SavedList";
import SetupNotice from "@/components/SetupNotice";
import { parseListParam } from "@/lib/list-types";
import {
  discoverNetflix,
  getGenres,
  hasCredentials,
  parseRatingFilter,
} from "@/lib/tmdb";
import type { Genre, Movie } from "@/lib/types";

export const revalidate = 3600;

// Gêneros em destaque na home (ids oficiais do TMDB).
const FEATURED_GENRES = [28, 35, 27, 18, 878, 10749, 16];

// Piso de votos ao filtrar por nota: evita que títulos obscuros com pouquíssimos
// votos (e nota inflada) dominem a grade.
const RATING_VOTE_FLOOR = 100;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ nota?: string; lista?: string }>;
}) {
  const sp = await searchParams;

  // Abas "Quero assistir" / "Já assisti": lista do usuário, sem depender do TMDB.
  const listStatus = parseListParam(sp?.lista);
  if (listStatus) return <SavedList status={listStatus} />;

  if (!hasCredentials()) return <SetupNotice />;

  const minRating = parseRatingFilter(sp?.nota);

  // Modo filtrado: as mesmas categorias da home, cada uma só com os filmes
  // acima da nota escolhida.
  if (minRating) {
    let genreRows: { title: string; movies: Movie[] }[] = [];
    try {
      const genres = await getGenres();
      const rows = await Promise.all(
        FEATURED_GENRES.map(async (id) => ({
          title: genres.find((g) => g.id === id)?.name ?? "",
          movies: await discoverNetflix({
            genreId: id,
            minRating,
            minVotes: RATING_VOTE_FLOOR,
            sortBy: "vote_average.desc",
          }),
        }))
      );
      genreRows = rows.filter((r) => r.title && r.movies.length);
    } catch (err) {
      return (
        <SetupNotice detail={err instanceof Error ? err.message : undefined} />
      );
    }

    return (
      <main className="relative z-10 px-6 pb-16 pt-28 md:px-12">
        <div className="mb-8">
          <ListTabs current={null} />
        </div>

        <h1 className="mb-6 font-display text-3xl uppercase tracking-tight md:text-4xl">
          <span className="text-gradient">Filmes com nota </span>
          <span className="text-gradient-red">{minRating}+</span>
        </h1>

        <RatingFilter active={minRating} />

        {genreRows.length > 0 ? (
          <div className="mt-8">
            {genreRows.map((row) => (
              <Row key={row.title} title={row.title} movies={row.movies} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-gray-400">
            Nenhum filme da Netflix atinge essa nota agora. Tente uma nota menor.
          </p>
        )}
      </main>
    );
  }

  // Modo normal: banner + prateleiras.
  let genres: Genre[] = [];
  let trending: Movie[] = [];
  let topRated: Movie[] = [];
  let genreRows: { title: string; movies: Movie[] }[] = [];

  try {
    [genres, trending, topRated] = await Promise.all([
      getGenres(),
      discoverNetflix({ sortBy: "popularity.desc" }),
      discoverNetflix({ sortBy: "vote_average.desc", minVotes: 300 }),
    ]);

    const genreName = (id: number) =>
      genres.find((g) => g.id === id)?.name ?? "";

    const rows = await Promise.all(
      FEATURED_GENRES.map(async (id) => ({
        title: genreName(id),
        movies: await discoverNetflix({ genreId: id, sortBy: "popularity.desc" }),
      }))
    );
    genreRows = rows.filter((r) => r.title && r.movies.length);
  } catch (err) {
    return <SetupNotice detail={err instanceof Error ? err.message : undefined} />;
  }

  const hero = trending.find((m) => m.backdrop_path) ?? trending[0];

  return (
    <main>
      {hero ? (
        <Hero movie={hero} />
      ) : (
        <div className="relative z-10 px-6 pt-28 md:px-12">
          <ListTabs current={null} />
        </div>
      )}

      <div className="relative z-10 -mt-16 px-6 pb-16 md:px-12">
        <RatingFilter active={null} />
        <Row title="Top 10 de hoje" movies={trending} ranked />
        <Row title="Em alta na Netflix" movies={trending} />
        <Row title="Mais bem avaliados" movies={topRated} />
        {genreRows.map((row) => (
          <Row key={row.title} title={row.title} movies={row.movies} />
        ))}
      </div>
    </main>
  );
}
