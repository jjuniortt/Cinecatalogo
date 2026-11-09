"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { parseListParam } from "@/lib/list-types";

const TABS = [
  { label: "Catálogo", href: "/", active: null },
  { label: "Quero assistir", href: "/?lista=quero", active: "quero_assistir" },
  { label: "Já assisti", href: "/?lista=assistido", active: "assistido" },
] as const;

/** Abas da página inicial: Catálogo, Quero assistir e Já assisti. */
export default function ListTabs() {
  const pathname = usePathname();
  const params = useSearchParams();

  if (pathname !== "/") return null;

  const current = parseListParam(params.get("lista"));

  return (
    <nav
      aria-label="Seções da página inicial"
      className="flex w-full gap-1 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-md md:w-auto"
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
