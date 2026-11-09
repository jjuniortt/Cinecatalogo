import Link from "next/link";
import { RATING_FILTERS } from "@/lib/tmdb";

/**
 * Barra de botões para filtrar a home por nota mínima (TMDB vote_average).
 * O estado mora na URL (`?nota=8`); cada botão é um link, sem JS no cliente.
 */
export default function RatingFilter({ active }: { active: number | null }) {
  const options: { label: string; value: number | null; href: string }[] = [
    { label: "Todos", value: null, href: "/" },
    ...RATING_FILTERS.map((n) => ({
      label: `${n}+`,
      value: n,
      href: `/?nota=${n}`,
    })),
  ];

  return (
    <section className="mb-8 flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-400">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-rating" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
        Nota mínima
      </span>

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = opt.value === active;
          return (
            <Link
              key={opt.label}
              href={opt.href}
              aria-current={isActive ? "true" : undefined}
              className={
                isActive
                  ? "rounded-full bg-gradient-to-r from-netflix-light to-netflix px-4 py-1.5 text-sm font-bold text-white shadow-glow transition-transform duration-200 hover:scale-[1.04]"
                  : "rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-semibold text-gray-300 backdrop-blur-md transition-all duration-200 hover:scale-[1.04] hover:border-white/25 hover:text-white"
              }
            >
              {opt.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
