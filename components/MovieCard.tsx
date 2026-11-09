import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/tmdb";
import type { Movie } from "@/lib/types";

export default function MovieCard({
  movie,
  rank,
}: {
  movie: Movie;
  rank?: number;
}) {
  const poster = imageUrl(movie.poster_path, "w500");
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "—";

  const card = (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-900 shadow-card ring-1 ring-white/5 transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-card-hover group-hover:ring-white/15">
      {poster ? (
        <Image
          src={poster}
          alt={movie.title}
          fill
          sizes="200px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full items-center justify-center p-3 text-center text-sm text-gray-400">
          {movie.title}
        </div>
      )}

      {/* Nota — sempre visível, com vidro fosco. */}
      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-xs font-bold text-rating backdrop-blur-md">
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
        {rating}
      </div>

      {/* Revelação no hover: gradiente + título. */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white">
          {movie.title}
        </h3>
        {year && <p className="mt-0.5 text-xs text-gray-400">{year}</p>}
        <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-black">
          <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
          Ver
        </span>
      </div>

      {/* Linha de brilho vermelho no rodapé ao passar o mouse. */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-netflix to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );

  // Variante "Top 10": número gigante contornado ao lado do pôster.
  if (rank) {
    return (
      <Link
        href={`/filme/${movie.id}`}
        className="group flex shrink-0 items-end"
        aria-label={`${rank}. ${movie.title}`}
      >
        <span className="rank-number -mr-5 select-none font-display text-[7.5rem] leading-[0.72] md:text-[9rem]">
          {rank}
        </span>
        <div className="w-[135px] md:w-[155px]">{card}</div>
      </Link>
    );
  }

  return (
    <Link
      href={`/filme/${movie.id}`}
      className="group block w-[150px] shrink-0 md:w-[180px]"
    >
      {card}
      <h3 className="mt-2.5 truncate px-0.5 text-sm font-semibold text-gray-200 transition-colors group-hover:text-white">
        {movie.title}
      </h3>
      <p className="px-0.5 text-[13px] text-gray-500">{year}</p>
    </Link>
  );
}
