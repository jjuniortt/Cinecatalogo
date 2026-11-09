// Tipos e textos das listas do usuário. Sem imports de servidor: este arquivo
// também é usado por componentes do navegador.

export type ListStatus = "quero_assistir" | "assistido";

export const LIST_META: Record<
  ListStatus,
  {
    label: string;
    tabParam: "quero" | "assistido";
    emptyTitle: string;
    emptyText: string;
  }
> = {
  quero_assistir: {
    label: "Quero assistir",
    tabParam: "quero",
    emptyTitle: "Sua lista de quero assistir está vazia",
    emptyText:
      "Abra um filme e toque em “Quero assistir” para guardá-lo aqui.",
  },
  assistido: {
    label: "Já assisti",
    tabParam: "assistido",
    emptyTitle: "Você ainda não marcou nenhum filme",
    emptyText:
      "Quando assistir a um filme, toque em “Já assisti” na página dele para registrar aqui.",
  },
};

/** Dados do filme guardados junto da lista, para mostrar a grade sem chamar o TMDB. */
export interface MoviePreview {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number | null;
}

export interface SavedMovie extends MoviePreview {
  status: ListStatus;
  updated_at: string;
}

/** Converte o valor de `?lista=` da URL num status válido (ou null). */
export function parseListParam(raw: string | undefined | null): ListStatus | null {
  if (raw === "quero") return "quero_assistir";
  if (raw === "assistido") return "assistido";
  return null;
}
