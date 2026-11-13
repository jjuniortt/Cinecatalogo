import Image from "next/image";
import Link from "next/link";
import ListTabs from "@/components/ListTabs";
import { imageUrl } from "@/lib/tmdb";
import type { Movie } from "@/lib/types";

export default function Hero({ movie }: { movie: Movie }) {
  const backdrop = imageUrl(movie.backdrop_path, "w1280");
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "—";
  const relevance = Math.round((movie.vote_average / 10) * 100);

  return (
    // Fluxo normal + padding-top reservando a altura da navbar fixa: se o
    // conteúdo crescer (títulos longos, telas baixas), a seção cresce junto
    // em vez de o texto subir por baixo do cabeçalho.
    <section className="relative flex min-h-[94vh] w-full flex-col justify-end overflow-hidden pt-32 md:pt-40">
      {/* Imagem com zoom cinematográfico lento (Ken Burns). */}
      {backdrop && (
        <div className="absolute inset-0 animate-slow-zoom">
          <Image
            src={backdrop}
            alt={movie.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      )}

      {/* Camadas de gradiente: legibilidade à esquerda, blend embaixo, vinheta. */}
      <div className="absolute inset-0 bg-gradient-to-r from-base via-base/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-base via-base/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-base/70 via-transparent to-transparent" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 90% at 72% 40%, transparent 40%, rgba(8,8,10,0.75) 100%)",
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10">
        <div className="max-w-3xl px-6 pb-28 md:px-12 md:pb-32">
          <div className="mb-6 inline-flex animate-fade-up items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-netflix" />
            Em destaque na Netflix
          </div>

          <h1 className="animate-fade-up font-display text-5xl uppercase leading-[0.95] tracking-tight drop-shadow-hero md:text-6xl lg:text-7xl xl:text-8xl [animation-delay:80ms]">
            {movie.title}
          </h1>

          <div className="mt-5 flex animate-fade-up flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-medium [animation-delay:160ms]">
            <span className="font-bold text-relevant">{relevance}% relevante</span>
            {year && <span className="text-gray-300">{year}</span>}
            <span className="flex items-center gap-1 font-bold text-rating">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
              {rating}
            </span>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="rounded border border-white/30 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-gray-200">
                4K ULTRA HD
              </span>
              <span className="rounded border border-white/30 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-gray-200">
                5.1
              </span>
            </div>
          </div>

          <p className="mt-5 max-w-xl animate-fade-up text-[17px] leading-relaxed text-gray-200/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] line-clamp-3 [animation-delay:240ms]">
            {movie.overview || "Sem sinopse disponível."}
          </p>

          <div className="mt-8 flex animate-fade-up gap-3 [animation-delay:320ms] md:gap-4">
            <Link
              href={`/filme/${movie.id}`}
              className="group flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-3 py-3 text-sm font-bold text-black shadow-xl transition-all duration-200 hover:scale-[1.03] hover:bg-white/90 md:flex-none md:gap-2.5 md:px-7 md:py-3.5 md:text-base"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current md:h-5 md:w-5" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
              Assistir detalhes
            </Link>
            <Link
              href={`/filme/${movie.id}`}
              className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-white/20 bg-white/10 px-3 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-200 hover:scale-[1.03] hover:bg-white/20 md:flex-none md:gap-2.5 md:px-7 md:py-3.5 md:text-base"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current md:h-5 md:w-5"
                aria-hidden
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              Mais informações
            </Link>
          </div>

          <div className="mt-6 animate-fade-up [animation-delay:400ms]">
            <ListTabs current={null} />
          </div>
        </div>
      </div>
    </section>
  );
}
