"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import AccountMenu from "./AccountMenu";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 flex flex-wrap items-center gap-x-4 gap-y-3 px-6 py-4 transition-all duration-300 md:gap-8 md:px-12 ${
        scrolled
          ? "border-b border-white/5 bg-base/80 py-3 shadow-lg backdrop-blur-xl"
          : "bg-gradient-to-b from-black/80 via-black/30 to-transparent"
      }`}
    >
      <Link
        href="/"
        className="font-display text-2xl tracking-wider transition-transform hover:scale-105 md:text-[1.7rem]"
      >
        <span className="text-white">CINE</span>
        <span className="text-gradient-red">CATÁLOGO</span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-medium text-gray-300 lg:flex">
        <Link href="/" className="transition-colors hover:text-white">
          Início
        </Link>
        <Link href="/busca" className="transition-colors hover:text-white">
          Buscar
        </Link>
      </nav>

      <Suspense fallback={<div className="ml-auto h-11 w-[min(460px,42vw)]" />}>
        <SearchBar />
      </Suspense>

      <AccountMenu />
    </header>
  );
}
