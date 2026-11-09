"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { setMovieStatus } from "@/app/actions/lists";
import { LIST_META, type ListStatus, type MoviePreview } from "@/lib/list-types";

/**
 * Botões "Quero assistir" e "Já assisti" da página do filme.
 * Quem não está logado é levado para o login, com volta para esta página.
 */
export default function WatchStatusButtons({
  movie,
  initialStatus,
  signedIn,
}: {
  movie: MoviePreview;
  initialStatus: ListStatus | null;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ListStatus | null>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginHref = `/entrar?next=${encodeURIComponent(`/filme/${movie.id}`)}`;

  async function toggle(target: ListStatus) {
    if (!signedIn) {
      router.push(loginHref);
      return;
    }
    if (saving) return;

    // Atualiza a tela na hora e volta atrás só se o servidor recusar.
    const previous = status;
    const next = status === target ? null : target;
    setStatus(next);
    setError(null);
    setSaving(true);

    const result = await setMovieStatus(movie, next);
    setSaving(false);

    if (!result.ok) {
      setStatus(previous);
      setError(result.error);
    }
  }

  return (
    <div className="mt-7">
      <div className="flex flex-wrap gap-3">
        <StatusButton
          active={status === "quero_assistir"}
          busy={saving}
          tone="white"
          label={LIST_META.quero_assistir.label}
          onClick={() => toggle("quero_assistir")}
        />
        <StatusButton
          active={status === "assistido"}
          busy={saving}
          tone="green"
          label={LIST_META.assistido.label}
          onClick={() => toggle("assistido")}
        />
      </div>

      <p className="mt-3 text-sm text-gray-400" aria-live="polite">
        {!signedIn
          ? "Entre na sua conta para guardar este filme nas suas listas."
          : status
            ? `Este filme está em “${LIST_META[status].label}”. Toque de novo no botão para tirar.`
            : "Escolha uma lista. Cada filme fica em uma lista por vez."}
      </p>

      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-netflix-light">
          {error}
        </p>
      )}
    </div>
  );
}

function StatusButton({
  active,
  busy,
  tone,
  label,
  onClick,
}: {
  active: boolean;
  busy: boolean;
  tone: "white" | "green";
  label: string;
  onClick: () => void;
}) {
  const activeClass =
    tone === "green"
      ? "border-relevant bg-relevant text-black shadow-[0_0_30px_-8px_rgba(70,211,105,0.8)]"
      : "border-white bg-white text-black shadow-card";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      disabled={busy}
      className={`inline-flex items-center gap-2 rounded-md border px-5 py-2.5 font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 ${
        active
          ? activeClass
          : "border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
      }`}
    >
      <span aria-hidden className="text-base leading-none">
        {active ? "✓" : "+"}
      </span>
      {label}
    </button>
  );
}
