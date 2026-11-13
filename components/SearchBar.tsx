"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setValue(params.get("q") ?? "");
  }, [params]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/busca?q=${encodeURIComponent(q)}`);
  }

  return (
    <form
      onSubmit={submit}
      className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl border bg-black/50 px-3 py-2.5 text-gray-300 backdrop-blur-md transition-all duration-300 md:ml-auto md:flex-none md:w-[min(460px,44vw)] md:gap-2.5 md:px-4 ${
        focused
          ? "border-netflix shadow-glow-soft"
          : "border-white/15 hover:border-white/30"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 shrink-0 transition-colors ${
          focused ? "text-netflix" : "text-gray-400"
        }`}
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 10-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1114 9.5 4.5 4.5 0 019.5 14z"
        />
      </svg>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Buscar filmes, séries, gêneros..."
        className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
      />
    </form>
  );
}
