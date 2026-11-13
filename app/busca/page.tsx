import MovieCard from "@/components/MovieCard";
import SetupNotice from "@/components/SetupNotice";
import { hasCredentials, searchMovies } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  if (!hasCredentials()) return <SetupNotice />;

  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const data = query
    ? await searchMovies(query)
    : { results: [], total_results: 0, page: 1, total_pages: 0 };

  return (
    <main className="relative z-10 px-6 pb-16 pt-28 md:px-12">
      <h1 className="font-display text-3xl uppercase tracking-tight md:text-4xl">
        {query ? (
          <>
            <span className="text-gradient">Resultados para </span>
            <span className="text-gradient-red">“{query}”</span>
          </>
        ) : (
          <span className="text-gradient">Digite algo na busca acima</span>
        )}
      </h1>

      {query && data.total_results > 0 && (
        <p className="mt-2 text-sm text-gray-400">
          {data.total_results} título{data.total_results === 1 ? "" : "s"}{" "}
          encontrado{data.total_results === 1 ? "" : "s"}
        </p>
      )}

      {query && data.results.length === 0 && (
        <p className="mt-6 text-gray-400">
          Nenhum filme encontrado. Tente outro termo.
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-5">
        {data.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
