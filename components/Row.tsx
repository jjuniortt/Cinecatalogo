"use client";

import { useRef } from "react";
import MovieCard from "./MovieCard";
import type { Movie } from "@/lib/types";

export default function Row({
  title,
  movies,
  ranked = false,
}: {
  title: string;
  movies: Movie[];
  ranked?: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  if (!movies.length) return null;

  function scrollBy(dir: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.82, behavior: "smooth" });
  }

  const list = ranked ? movies.slice(0, 10) : movies;

  return (
    <section className="group/row relative mb-10">
      <h2 className="mb-4 flex items-center gap-3 text-lg font-bold tracking-tight md:text-xl">
        <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-netflix-light to-netflix shadow-glow" />
        <span className="text-gradient">{title}</span>
      </h2>

      <div className="relative">
        {/* Seta esquerda */}
        <button
          type="button"
          aria-label="Rolar para a esquerda"
          onClick={() => scrollBy(-1)}
          className="absolute left-0 top-0 z-20 hidden h-full w-14 items-center justify-center rounded-l-xl bg-gradient-to-r from-base/95 to-transparent text-white opacity-0 transition-opacity duration-200 hover:from-base group-hover/row:opacity-100 md:flex"
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current drop-shadow-lg">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <div
          ref={scroller}
          className={`no-scrollbar flex overflow-x-auto scroll-smooth ${
            ranked
              ? "gap-2 pl-1 overflow-y-hidden pb-5 pt-2"
              : "gap-3.5 pb-3 pt-1"
          }`}
        >
          {list.map((movie, i) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              rank={ranked ? i + 1 : undefined}
            />
          ))}
        </div>

        {/* Seta direita */}
        <button
          type="button"
          aria-label="Rolar para a direita"
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-0 z-20 hidden h-full w-14 items-center justify-center rounded-r-xl bg-gradient-to-l from-base/95 to-transparent text-white opacity-0 transition-opacity duration-200 hover:from-base group-hover/row:opacity-100 md:flex"
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current drop-shadow-lg">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      </div>
    </section>
  );
}
