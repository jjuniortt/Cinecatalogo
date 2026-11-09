"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { supabaseConfigured } from "@/lib/supabase/config";

type Mode = "entrar" | "cadastro";

/** Só aceita caminhos internos (evita redirecionar para outro site). */
function safeNext(raw: string): string {
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}

export default function AuthForm({ next }: { next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  if (!supabaseConfigured()) {
    return (
      <div className="rounded-2xl border border-netflix/40 bg-neutral-900/60 p-8 text-center">
        <h1 className="mb-3 text-2xl font-bold">Login ainda não configurado</h1>
        <p className="text-gray-300">
          Preencha <code className="text-rating">NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
          <code className="text-rating">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> no
          arquivo <code>.env.local</code> e reinicie o servidor.
        </p>
      </div>
    );
  }

  const isSignUp = mode === "cadastro";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);

    const supabase = createClient();
    const credentials = { email: email.trim(), password };

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp(credentials);
      setPending(false);
      if (error) {
        setError(translateError(error.message));
        return;
      }
      if (data.session) {
        router.push(safeNext(next));
        router.refresh();
      } else {
        // Com confirmação de email ligada no Supabase, não há sessão ainda.
        setInfo(
          "Conta criada! Enviamos um link de confirmação para o seu email. Confirme e depois entre aqui."
        );
        setMode("entrar");
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword(credentials);
    setPending(false);
    if (error) {
      setError(translateError(error.message));
      return;
    }
    router.push(safeNext(next));
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-7 shadow-card backdrop-blur-xl md:p-9">
      <h1 className="font-display text-3xl uppercase tracking-tight">
        {isSignUp ? "Criar conta" : "Entrar"}
      </h1>
      <p className="mt-2 text-sm text-gray-400">
        {isSignUp
          ? "Com uma conta, suas listas ficam salvas e você as acessa de qualquer aparelho."
          : "Entre para ver suas listas de filmes."}
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-gray-300">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-netflix"
            placeholder="voce@email.com"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-gray-300">Senha</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-netflix"
            placeholder={isSignUp ? "Mínimo de 6 caracteres" : "Sua senha"}
          />
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-netflix/15 px-4 py-3 text-sm text-netflix-light">
            {error}
          </p>
        )}
        {info && (
          <p role="status" className="rounded-lg bg-relevant/10 px-4 py-3 text-sm text-relevant">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-gradient-to-r from-netflix-light to-netflix py-3 font-bold text-white shadow-glow transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Aguarde..." : isSignUp ? "Criar conta" : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        {isSignUp ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(isSignUp ? "entrar" : "cadastro");
            setError(null);
            setInfo(null);
          }}
          className="font-semibold text-white underline-offset-4 hover:underline"
        >
          {isSignUp ? "Entrar" : "Criar conta"}
        </button>
      </p>

      <Link href="/" className="mt-4 block text-center text-sm text-gray-500 hover:text-gray-300">
        ← Voltar ao catálogo
      </Link>
    </div>
  );
}

function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Email ou senha incorretos.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Este email já tem uma conta. Tente entrar.";
  if (m.includes("password")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (m.includes("email not confirmed")) return "Confirme seu email antes de entrar.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Muitas tentativas seguidas. Espere um pouco e tente de novo.";
  return "Não foi possível concluir agora. Tente de novo.";
}
