"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { supabaseConfigured } from "@/lib/supabase/config";

/**
 * Indicador de conta no canto da barra: botão "Entrar" ou a inicial do email com "Sair".
 * undefined = ainda carregando; null = sem login.
 */
export default function AccountMenu() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (!supabaseConfigured()) {
      setEmail(null);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (email === undefined) {
    return <div className="h-10 w-10 shrink-0" aria-hidden />;
  }

  if (!email) {
    return (
      <Link
        href="/entrar"
        className="shrink-0 rounded-md border border-white/25 bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/10"
      >
        Entrar
      </Link>
    );
  }

  async function signOut() {
    await createClient().auth.signOut();
    router.refresh();
  }

  return (
    <div className="flex shrink-0 items-center gap-3">
      <span
        title={email}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-netflix-light to-netflix text-sm font-bold uppercase text-white shadow-glow"
      >
        {email.charAt(0)}
      </span>
      <button
        type="button"
        onClick={signOut}
        className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
      >
        Sair
      </button>
    </div>
  );
}
