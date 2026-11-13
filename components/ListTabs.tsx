import Link from "next/link";
import type { ListStatus } from "@/lib/list-types";

const TABS = [
  { label: "Catálogo", href: "/", active: null },
  { label: "Quero assistir", href: "/?lista=quero", active: "quero_assistir" },
  { label: "Já assisti", href: "/?lista=assistido", active: "assistido" },
] as const;

/**
 * Abas da página inicial: Catálogo, Quero assistir e Já assisti.
 * A aba atual vem da página (já lida da URL no servidor), então o componente
 * não precisa de JS no cliente.
 */
export default function ListTabs({ current }: { current: ListStatus | null }) {
  return (
    <nav
      aria-label="Seções da página inicial"
      className="flex w-full gap-1 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-md md:w-fit"
    >
      {TABS.map((tab) => {
        const isActive = tab.active === current;
        return (
          <Link
            key={tab.label}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex-1 whitespace-nowrap rounded-full px-4 py-1.5 text-center text-sm font-semibold transition-all duration-200 md:flex-none ${
              isActive
                ? "bg-gradient-to-r from-netflix-light to-netflix text-white shadow-glow"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
