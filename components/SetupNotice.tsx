export default function SetupNotice({ detail }: { detail?: string }) {
  return (
    <div className="mx-auto mt-40 max-w-2xl rounded-xl border border-netflix/40 bg-neutral-900/60 p-8 text-center">
      <h1 className="mb-3 text-2xl font-bold">
        Configure sua chave do TMDB
      </h1>
      <p className="mb-5 text-gray-300">
        O catálogo precisa de uma credencial do TMDB para carregar os filmes.
        Pegue a sua em{" "}
        <a
          href="https://www.themoviedb.org/settings/api"
          target="_blank"
          rel="noreferrer"
          className="text-netflix underline"
        >
          themoviedb.org/settings/api
        </a>{" "}
        e preencha o arquivo <code className="text-rating">.env.local</code>:
      </p>
      <pre className="mb-5 overflow-x-auto rounded-lg bg-black/60 p-4 text-left text-sm text-gray-200">
{`TMDB_ACCESS_TOKEN=seu_token_de_leitura_v4
# ou
TMDB_API_KEY=sua_chave_v3`}
      </pre>
      <p className="text-sm text-gray-400">
        Depois reinicie o servidor com <code>npm run dev</code>.
      </p>
      {detail && (
        <p className="mt-4 text-xs text-gray-500">Detalhe: {detail}</p>
      )}
    </div>
  );
}
