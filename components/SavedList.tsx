import Image from "next/image";
import Link from "next/link";
import ListTabs from "@/components/ListTabs";
import { getCurrentUser, getSavedMovies } from "@/lib/lists";
import { LIST_META, type ListStatus, type SavedMovie } from "@/lib/list-types";
import { imageUrl } from "@/lib/tmdb";
import { supabaseConfigured } from "@/lib/supabase/config";

/** Página de uma lista do usuário, mostrada no lugar do catálogo quando há `?lista=`. */
export default async function SavedList({ status }: { status: ListStatus }) {
  const meta = LIST_META[status];
  const listHref = `/?lista=${meta.tabParam}`;
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Shell status={status} title={meta.label}>
        <EmptyState
          title="Entre para ver suas listas"
          text={
            supabaseConfigured()
              ? "Suas listas ficam salvas na sua conta, então você as encontra em qualquer aparelho."
              : "O login ainda não está configurado neste ambiente."
          }
          action={
            supabaseConfigured() ? (
              <Link
                href={`/entrar?next=${encodeURIComponent(listHref)}`}
                className="rounded-md bg-gradient-to-r from-netflix-light to-netflix px-6 py-3 font-bold text-white shadow-glow transition-transform hover:scale-[1.03]"
              >
                Entrar na minha conta
              </Link>
            ) : null
          }
        />
      </Shell>
    );
  }

  const movies = await getSavedMovies(status);

  return (
    <Shell
      status={status}
      title={meta.label}
      subtitle={
        movies.length === 1
          ? "1 filme nesta lista"
          : `${movies.length} filmes nesta lista`
      }
    >
      {movies.length === 0 ? (
        <EmptyState
          title={meta.emptyTitle}
          text={meta.emptyText}
          action={
            <Link
              href="/"
              className="rounded-md border border-white/25 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explorar o catálogo
            </Link>
          }
        />
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {movies.map((movie) => (
            <li key={movie.id}>
              <SavedCard movie={movie} />
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}

function Shell({
  status,
  title,
  subtitle,
  children,
}: {
  status: ListStatus;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative z-10 px-6 pb-16 pt-32 md:px-12">
      <div className="mb-8">
        <ListTabs current={status} />
      </div>
      <header className="mb-8">
        <h1 className="font-display text-3xl uppercase tracking-tight md:text-5xl">
          <span className="text-gradient">{title}</span>
        </h1>
        {subtitle && <p className="mt-2 text-gray-400">{subtitle}</p>}
      </header>
      {children}
    </main>
  );
}

function SavedCard({ movie }: { movie: SavedMovie }) {
  const poster = imageUrl(movie.poster_path, "w500");
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "";

  return (
    <Link href={`/filme/${movie.id}`} className="group block">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-900 shadow-card ring-1 ring-white/5 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-card-hover group-hover:ring-white/15">
        {poster ? (
          <Image
            src={poster}
            alt={movie.title}
            fill
            sizes="(min-width: 1280px) 16vw, (min-width: 768px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-3 text-center text-sm text-gray-400">
            {movie.title}
          </div>
        )}
        {movie.vote_average ? (
          <div className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-bold text-rating backdrop-blur-md">
            ★ {movie.vote_average.toFixed(1)}
          </div>
        ) : null}
      </div>
      <h2 className="mt-2.5 truncate px-0.5 text-sm font-semibold text-gray-200 transition-colors group-hover:text-white">
        {movie.title}
      </h2>
      <p className="px-0.5 text-[13px] text-gray-500">{year}</p>
    </Link>
  );
}

function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mx-auto mt-10 flex max-w-lg flex-col items-center rounded-2xl border border-white/10 bg-neutral-900/50 px-8 py-12 text-center backdrop-blur-sm">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-netflix-light to-netflix text-2xl text-white shadow-glow">
        +
      </span>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-gray-400">{text}</p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}
