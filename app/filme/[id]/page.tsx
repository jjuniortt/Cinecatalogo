import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SetupNotice from "@/components/SetupNotice";
import WatchStatusButtons from "@/components/WatchStatusButtons";
import { getMyMovieStatus } from "@/lib/lists";
import {
  getMovie,
  hasCredentials,
  imageUrl,
  NETFLIX_PROVIDER_ID,
  WATCH_REGION,
} from "@/lib/tmdb";

export const revalidate = 3600;

function minutesToHuman(min: number | null): string {
  if (!min) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}min` : `${m}min`;
}

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  if (!hasCredentials()) return <SetupNotice />;

  let movie;
  try {
    movie = await getMovie(params.id);
  } catch {
    notFound();
  }
  if (!movie || !movie.id) notFound();

  const { signedIn, status } = await getMyMovieStatus(movie.id);

  const backdrop = imageUrl(movie.backdrop_path, "w1280");
  const poster = imageUrl(movie.poster_path, "w500");
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "—";
  const cast = movie.credits?.cast?.slice(0, 6) ?? [];
  const trailer = movie.videos?.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );
  const providers =
    movie["watch/providers"]?.results?.[WATCH_REGION]?.flatrate ?? [];
  const onNetflix = providers.some(
    (p) => p.provider_id === NETFLIX_PROVIDER_ID
  );

  return (
    <main className="pb-16">
      {/* Backdrop */}
      <section className="relative h-[66vh] min-h-[440px] w-full overflow-hidden">
        {backdrop && (
          <div className="absolute inset-0 animate-slow-zoom">
            <Image
              src={backdrop}
              alt={movie.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top brightness-[0.65]"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-base/70 via-transparent to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 10%, transparent 45%, rgba(8,8,10,0.6) 100%)",
          }}
        />
      </section>

      <div className="relative z-10 -mt-48 px-6 md:px-12">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Poster */}
          <div className="relative aspect-[2/3] w-44 shrink-0 overflow-hidden rounded-2xl bg-neutral-800 shadow-card ring-1 ring-white/10 md:w-60">
            {poster ? (
              <Image
                src={poster}
                alt={movie.title}
                fill
                sizes="240px"
                className="object-cover"
              />
            ) : null}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="font-display text-4xl uppercase leading-[0.95] tracking-tight drop-shadow-hero md:text-6xl">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="mt-2 italic text-gray-400">{movie.tagline}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-[15px]">
              <span className="font-bold text-rating">★ {rating}</span>
              <span className="text-gray-400">TMDB</span>
              {year && <span>{year}</span>}
              {movie.runtime ? (
                <span>{minutesToHuman(movie.runtime)}</span>
              ) : null}
              {onNetflix && (
                <span className="rounded bg-netflix px-2 py-0.5 text-xs font-bold">
                  NETFLIX
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-sm text-gray-200 backdrop-blur-sm transition-colors hover:border-white/30 hover:text-white"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-gray-200">
              {movie.overview || "Sem sinopse disponível."}
            </p>

            <WatchStatusButtons
              movie={{
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date || null,
                vote_average: movie.vote_average || null,
              }}
              initialStatus={status}
              signedIn={signedIn}
            />
          </div>
        </div>

        {/* Elenco */}
        {cast.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 flex items-center gap-3 text-xl font-bold">
              <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-netflix-light to-netflix shadow-glow" />
              <span className="text-gradient">Elenco</span>
            </h2>
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
              {cast.map((person) => {
                const photo = imageUrl(person.profile_path, "w185");
                return (
                  <div key={person.id} className="w-28 shrink-0 text-center">
                    <div className="relative mx-auto aspect-[2/3] w-28 overflow-hidden rounded-xl bg-neutral-800 ring-1 ring-white/10 transition-transform duration-300 hover:scale-105">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={person.name}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <p className="mt-2 truncate text-sm font-semibold">
                      {person.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {person.character}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Trailer */}
        {trailer && (
          <section className="mt-12">
            <h2 className="mb-4 flex items-center gap-3 text-xl font-bold">
              <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-netflix-light to-netflix shadow-glow" />
              <span className="text-gradient">Trailer</span>
            </h2>
            <div className="aspect-video w-full max-w-3xl overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-card">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link href="/" className="text-netflix hover:underline">
            ← Voltar ao catálogo
          </Link>
        </div>
      </div>
    </main>
  );
}
