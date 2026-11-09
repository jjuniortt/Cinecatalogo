-- CineCatálogo: lista de filmes por usuário.
-- Rode este arquivo uma vez no SQL Editor do Supabase (Dashboard > SQL Editor).

create table if not exists public.user_movies (
  user_id      uuid        not null references auth.users (id) on delete cascade,
  movie_id     integer     not null,               -- id do filme no TMDB
  status       text        not null check (status in ('quero_assistir', 'assistido')),
  title        text        not null,              -- guardado para montar a lista sem chamar o TMDB
  poster_path  text,
  release_date text,
  vote_average numeric(3, 1),
  updated_at   timestamptz not null default now(),
  -- Uma linha por (usuário, filme): um filme só pode estar em uma lista.
  -- Marcar "já assisti" troca o status da mesma linha, então ele sai de "quero assistir".
  primary key (user_id, movie_id)
);

create index if not exists user_movies_user_status_idx
  on public.user_movies (user_id, status, updated_at desc);

-- Segurança: cada pessoa só enxerga e altera as próprias linhas.
alter table public.user_movies enable row level security;

drop policy if exists "Ver as próprias listas" on public.user_movies;
create policy "Ver as próprias listas"
  on public.user_movies for select
  using (auth.uid() = user_id);

drop policy if exists "Adicionar às próprias listas" on public.user_movies;
create policy "Adicionar às próprias listas"
  on public.user_movies for insert
  with check (auth.uid() = user_id);

drop policy if exists "Alterar as próprias listas" on public.user_movies;
create policy "Alterar as próprias listas"
  on public.user_movies for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Remover das próprias listas" on public.user_movies;
create policy "Remover das próprias listas"
  on public.user_movies for delete
  using (auth.uid() = user_id);
