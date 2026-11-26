create extension if not exists pgcrypto;

-- Tipos usados pelo aplicativo
do $$ begin
  create type public.app_role as enum ('usuario', 'administrador', 'editor', 'suporte');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.task_status as enum ('pendente', 'em_andamento', 'concluida', 'cancelada');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.content_status as enum ('rascunho', 'publicado', 'arquivado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.ticket_status as enum ('aberto', 'em_atendimento', 'resolvido', 'fechado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.plan_status as enum ('ativo', 'inativo');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- PERFIS: complementa auth.users; o e-mail e a senha são do Auth.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome_completo text not null default '',
  data_nascimento date,
  email text,
  foto_url text,
  role public.app_role not null default 'usuario',
  ativo boolean not null default true,
  onboarding_concluido boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint profiles_nome_nao_vazio check (length(trim(nome_completo)) > 0)
);

-- Cria o perfil automaticamente quando uma conta é criada no Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nome_completo, email)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'nome_completo'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Usuário'
    ),
    new.email
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.handle_profile_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute procedure public.handle_profile_updated_at();

-- Funções auxiliares de autorização para políticas RLS.
create or replace function public.current_user_is_active()
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.ativo = true
  );
$$;

create or replace function public.current_user_has_admin_access()
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.ativo = true
      and p.role in ('administrador', 'editor', 'suporte')
  );
$$;

create or replace function public.current_user_is_admin()
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.ativo = true
      and p.role = 'administrador'
  );
$$;

create or replace function public.current_user_role()
returns public.app_role language sql stable security definer
set search_path = ''
as $$
  select p.role from public.profiles p
  where p.id = (select auth.uid()) and p.ativo = true
  limit 1;
$$;

create or replace function public.current_user_can_edit_content()
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.ativo = true
      and p.role in ('administrador', 'editor')
  );
$$;

-- ------------------------------------------------------------
-- PREFERÊNCIAS E ACESSIBILIDADE

create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  tema text not null default 'sistema' check (tema in ('claro', 'escuro', 'sistema')),
  notificacoes_push boolean not null default true,
  notificacoes_email boolean not null default true,
  lembretes_ativados boolean not null default true,
  lembretes_antecedencia_min integer not null default 15 check (lembretes_antecedencia_min between 0 and 10080),
  texto_maior boolean not null default false,
  alto_contraste boolean not null default false,
  reduzir_animacoes boolean not null default false,
  sons_ativados boolean not null default false,
  preferencias_extras jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now()
);

-- ------------------------------------------------------------
-- TAREFAS E AGENDA

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  titulo text not null,
  descricao text not null default '',
  data_vencimento date,
  horario time,
  status public.task_status not null default 'pendente',
  repetir boolean not null default false,
  regra_repeticao text,
  lembrete boolean not null default false,
  lembrete_em timestamptz,
  prioridade smallint not null default 2 check (prioridade between 1 and 3),
  concluida_em timestamptz,
  ordem integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint tasks_titulo_nao_vazio check (length(trim(titulo)) > 0)
);

create table if not exists public.agenda_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  titulo text not null,
  descricao text not null default '',
  inicio timestamptz,
  fim timestamptz,
  data_evento date,
  horario text,
  dia_inteiro boolean not null default false,
  local text,
  lembrete boolean not null default false,
  lembrete_em timestamptz,
  cor text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint agenda_titulo_nao_vazio check (length(trim(titulo)) > 0),
  constraint agenda_intervalo_valido check (fim is null or inicio is null or fim >= inicio)
);

-- ------------------------------------------------------------
-- METAS E CONQUISTAS

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  nome text not null,
  descricao text not null default '',
  categoria text,
  data_limite date,
  status text not null default 'ativa' check (status in ('ativa', 'concluida', 'pausada', 'cancelada')),
  progresso smallint not null default 0 check (progresso between 0 and 100),
  concluida_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint goals_nome_nao_vazio check (length(trim(nome)) > 0)
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nome text not null,
  descricao text not null default '',
  icone text,
  criterio jsonb not null default '{}'::jsonb,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table if not exists public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  conquistado_em timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- ------------------------------------------------------------
-- FINANÇAS PESSOAIS

create table if not exists public.finance_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  salario_mensal numeric(12,2) not null default 0 check (salario_mensal >= 0),
  moeda char(3) not null default 'BRL',
  atualizado_em timestamptz not null default now()
);

create table if not exists public.finance_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('receita', 'despesa')),
  cor text,
  icone text,
  categoria_padrao boolean not null default false,
  criado_em timestamptz not null default now(),
  constraint finance_category_unique_per_user unique (user_id, nome, tipo)
);

create table if not exists public.finance_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.finance_categories(id) on delete set null,
  descricao text not null,
  tipo text not null check (tipo in ('receita', 'despesa')),
  valor numeric(12,2) not null check (valor > 0),
  data_movimento date not null default current_date,
  pago boolean not null default true,
  observacoes text not null default '',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint finance_transaction_description_not_empty check (length(trim(descricao)) > 0)
);

-- ------------------------------------------------------------
-- BIBLIOTECA / CONTEÚDOS / FAVORITOS

create table if not exists public.content_categories (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  slug text not null unique,
  descricao text not null default '',
  ordem integer not null default 0,
  ativo boolean not null default true
);

create table if not exists public.library_contents (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.content_categories(id) on delete set null,
  titulo text not null,
  resumo text not null default '',
  conteudo text not null default '',
  tipo text not null default 'artigo' check (tipo in ('artigo', 'dica', 'passo_a_passo', 'receita', 'video', 'link')),
  imagem_url text,
  url_externa text,
  status public.content_status not null default 'rascunho',
  criado_por uuid references public.profiles(id) on delete set null,
  atualizado_por uuid references public.profiles(id) on delete set null,
  publicado_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint library_title_not_empty check (length(trim(titulo)) > 0)
);

create table if not exists public.content_favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  content_id uuid not null references public.library_contents(id) on delete cascade,
  criado_em timestamptz not null default now(),
  primary key (user_id, content_id)
);

-- ------------------------------------------------------------
-- SUPORTE, FALE CONOSCO, SUGESTÕES E RELATÓRIOS DE PROBLEMA

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  nome text not null,
  email text not null,
  assunto text not null,
  mensagem text not null,
  status public.ticket_status not null default 'aberto',
  prioridade text not null default 'normal' check (prioridade in ('baixa', 'normal', 'alta', 'urgente')),
  responsavel_id uuid references public.profiles(id) on delete set null,
  resposta text,
  respondido_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.problem_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  assunto text not null,
  descricao text not null,
  tela text,
  dispositivo text,
  status public.ticket_status not null default 'aberto',
  prioridade text not null default 'normal' check (prioridade in ('baixa', 'normal', 'alta', 'urgente')),
  responsavel_id uuid references public.profiles(id) on delete set null,
  resolucao text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.user_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  assunto text not null,
  sugestao text not null,
  status text not null default 'recebida' check (status in ('recebida', 'em_analise', 'aceita', 'recusada', 'implementada')),
  resposta_admin text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- ------------------------------------------------------------
-- PLANOS, ASSINATURAS E PAGAMENTOS
-- Não armazene número completo de cartão ou CVV.
-- Integre um provedor de pagamento no backend quando necessário.
-- ------------------------------------------------------------
create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nome text not null,
  descricao text not null default '',
  preco_mensal numeric(12,2) not null default 0 check (preco_mensal >= 0),
  preco_anual numeric(12,2) not null default 0 check (preco_anual >= 0),
  recursos jsonb not null default '[]'::jsonb,
  status public.plan_status not null default 'ativo',
  ordem integer not null default 0,
  criado_em timestamptz not null default now()
);

create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.subscription_plans(id) on delete restrict,
  status text not null default 'pendente' check (status in ('pendente', 'ativa', 'cancelada', 'expirada', 'inadimplente')),
  periodo text not null default 'mensal' check (periodo in ('mensal', 'anual')),
  inicio_em timestamptz,
  fim_em timestamptz,
  cancelar_no_fim boolean not null default false,
  provedor text,
  id_assinatura_provedor text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.payment_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subscription_id uuid references public.user_subscriptions(id) on delete set null,
  valor numeric(12,2) not null check (valor >= 0),
  moeda char(3) not null default 'BRL',
  status text not null default 'pendente' check (status in ('pendente', 'aprovado', 'recusado', 'estornado', 'cancelado')),
  metodo text check (metodo in ('cartao', 'pix', 'boleto', 'outro')),
  provedor text,
  id_pagamento_provedor text,
  pago_em timestamptz,
  criado_em timestamptz not null default now()
);

-- ------------------------------------------------------------
-- NOTIFICAÇÕES E CONFIGURAÇÕES DO APP

create table if not exists public.notification_campaigns (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  mensagem text not null,
  enviar_push boolean not null default true,
  enviar_email boolean not null default false,
  publico_alvo text not null default 'todos' check (publico_alvo in ('todos', 'gratuito', 'premium', 'selecionados')),
  agendada_para timestamptz,
  enviada_em timestamptz,
  status text not null default 'rascunho' check (status in ('rascunho', 'agendada', 'enviada', 'cancelada')),
  criado_por uuid references public.profiles(id) on delete set null,
  criado_em timestamptz not null default now()
);

create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  campaign_id uuid references public.notification_campaigns(id) on delete set null,
  titulo text not null,
  mensagem text not null,
  lida boolean not null default false,
  lida_em timestamptz,
  criada_em timestamptz not null default now()
);

create table if not exists public.app_settings (
  chave text primary key,
  valor jsonb not null default '{}'::jsonb,
  descricao text not null default '',
  atualizado_por uuid references public.profiles(id) on delete set null,
  atualizado_em timestamptz not null default now()
);

-- Registro de atividades administrativas para a tela de logs.
create table if not exists public.admin_audit_logs (
  id bigint generated always as identity primary key,
  admin_id uuid references public.profiles(id) on delete set null,
  acao text not null,
  descricao text not null,
  tabela_afetada text,
  registro_id text,
  detalhes jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ÍNDICES

create index if not exists idx_tasks_user_date on public.tasks(user_id, data_vencimento);
create index if not exists idx_tasks_user_status on public.tasks(user_id, status);
create index if not exists idx_agenda_user_date on public.agenda_events(user_id, data_evento, inicio);
create index if not exists idx_goals_user_status on public.goals(user_id, status);
create index if not exists idx_finance_tx_user_date on public.finance_transactions(user_id, data_movimento desc);
create index if not exists idx_content_status_category on public.library_contents(status, category_id);
create index if not exists idx_support_status_date on public.support_tickets(status, criado_em desc);
create index if not exists idx_problem_reports_status on public.problem_reports(status, criado_em desc);
create index if not exists idx_suggestions_status on public.user_suggestions(status, criado_em desc);
create index if not exists idx_user_notifications_user_unread on public.user_notifications(user_id, lida, criada_em desc);
create index if not exists idx_subscriptions_user_status on public.user_subscriptions(user_id, status);

-- ------------------------------------------------------------
-- ATUALIZAÇÃO AUTOMÁTICA DE updated_at/atualizado_em

create or replace function public.set_atualizado_em()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'tasks', 'agenda_events', 'goals', 'finance_transactions',
    'library_contents', 'support_tickets', 'problem_reports',
    'user_suggestions', 'user_subscriptions'
  ]
  loop
    execute format('drop trigger if exists set_atualizado_em on public.%I', t);
    execute format(
      'create trigger set_atualizado_em before update on public.%I for each row execute procedure public.set_atualizado_em()',
      t
    );
  end loop;
end $$;

-- Helper de assinatura Premium precisa existir antes das políticas RLS.
create or replace function public.current_user_has_premium()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_subscriptions us
    join public.subscription_plans sp on sp.id = us.plan_id
    where us.user_id = (select auth.uid())
      and sp.codigo = 'premium'
      and us.status = 'ativa'
      and (us.inicio_em is null or us.inicio_em <= now())
      and (us.fim_em is null or us.fim_em > now())
  );
$$;

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- Cada usuário acessa apenas seus dados. Administração exige perfil autorizado.
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.tasks enable row level security;
alter table public.agenda_events enable row level security;
alter table public.goals enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.finance_settings enable row level security;
alter table public.finance_categories enable row level security;
alter table public.finance_transactions enable row level security;
alter table public.content_categories enable row level security;
alter table public.library_contents enable row level security;
alter table public.content_favorites enable row level security;
alter table public.support_tickets enable row level security;
alter table public.problem_reports enable row level security;
alter table public.user_suggestions enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.payment_records enable row level security;
alter table public.notification_campaigns enable row level security;
alter table public.user_notifications enable row level security;
alter table public.app_settings enable row level security;
alter table public.admin_audit_logs enable row level security;

-- profiles: usuário lê/edita os próprios dados básicos; admin pode gerenciar perfis.
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.current_user_has_admin_access());

drop policy if exists profiles_update_own_or_admin on public.profiles;
create policy profiles_update_own_or_admin on public.profiles for update to authenticated
using (id = (select auth.uid()) or public.current_user_is_admin())
with check (
  (id = (select auth.uid()) and role = public.current_user_role())
  or public.current_user_is_admin()
);

-- Usuários não podem atribuir para si mesmos cargos elevados via insert. (Mecanismo de Segurança)
drop policy if exists profiles_insert_admin_only on public.profiles;
create policy profiles_insert_admin_only on public.profiles for insert to authenticated
with check (public.current_user_is_admin());

-- Tabelas particulares: políticas por proprietário.
drop policy if exists preferences_own on public.user_preferences;
create policy preferences_own on public.user_preferences for all to authenticated
using (user_id = (select auth.uid()) and public.current_user_is_active())
with check (user_id = (select auth.uid()) and public.current_user_is_active());

drop policy if exists tasks_own on public.tasks;
create policy tasks_own on public.tasks for all to authenticated
using (user_id = (select auth.uid()) and public.current_user_is_active())
with check (user_id = (select auth.uid()) and public.current_user_is_active());

drop policy if exists agenda_events_own on public.agenda_events;
create policy agenda_events_own on public.agenda_events for all to authenticated
using (user_id = (select auth.uid()) and public.current_user_is_active())
with check (user_id = (select auth.uid()) and public.current_user_is_active());

drop policy if exists goals_own on public.goals;
create policy goals_own on public.goals for all to authenticated
using (user_id = (select auth.uid()) and public.current_user_is_active())
with check (user_id = (select auth.uid()) and public.current_user_is_active());

drop policy if exists user_achievements_select_own on public.user_achievements;
create policy user_achievements_select_own on public.user_achievements for select to authenticated
using (user_id = (select auth.uid()) or public.current_user_has_admin_access());

drop policy if exists user_achievements_admin_manage on public.user_achievements;
create policy user_achievements_admin_manage on public.user_achievements for all to authenticated
using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists achievements_read_active on public.achievements;
create policy achievements_read_active on public.achievements for select to authenticated
using (ativo = true or public.current_user_has_admin_access());

drop policy if exists achievements_admin_manage on public.achievements;
create policy achievements_admin_manage on public.achievements for all to authenticated
using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists finance_settings_own on public.finance_settings;
create policy finance_settings_own on public.finance_settings for all to authenticated
using (user_id = (select auth.uid()) and public.current_user_is_active())
with check (user_id = (select auth.uid()) and public.current_user_is_active());

drop policy if exists finance_categories_read_own_or_default on public.finance_categories;
create policy finance_categories_read_own_or_default on public.finance_categories for select to authenticated
using (user_id = (select auth.uid()) or (user_id is null and categoria_padrao = true) or public.current_user_is_admin());

drop policy if exists finance_categories_manage_own on public.finance_categories;
create policy finance_categories_manage_own on public.finance_categories for all to authenticated
using (user_id = (select auth.uid()) and public.current_user_is_active())
with check (user_id = (select auth.uid()) and public.current_user_is_active());

drop policy if exists finance_transactions_own on public.finance_transactions;
drop policy if exists finance_transactions_read_plan_scope on public.finance_transactions;
drop policy if exists finance_transactions_insert_own on public.finance_transactions;
drop policy if exists finance_transactions_update_own on public.finance_transactions;
drop policy if exists finance_transactions_delete_own on public.finance_transactions;
-- Premium vê o histórico completo. No plano gratuito, a leitura fica limitada
-- ao mês atual e às despesas ainda não pagas (para a tela 'despesas a pagar').
create policy finance_transactions_read_plan_scope on public.finance_transactions for select to authenticated
using (
  user_id = (select auth.uid()) and public.current_user_is_active()
  and (
    public.current_user_has_premium()
    or (
      data_movimento >= date_trunc('month', current_date)::date
      and data_movimento < (date_trunc('month', current_date) + interval '1 month')::date
    )
    or (tipo = 'despesa' and pago = false)
  )
);
create policy finance_transactions_insert_own on public.finance_transactions for insert to authenticated
with check (user_id = (select auth.uid()) and public.current_user_is_active());
create policy finance_transactions_update_own on public.finance_transactions for update to authenticated
using (user_id = (select auth.uid()) and public.current_user_is_active())
with check (user_id = (select auth.uid()) and public.current_user_is_active());
create policy finance_transactions_delete_own on public.finance_transactions for delete to authenticated
using (user_id = (select auth.uid()) and public.current_user_is_active());

-- Conteúdo publicado é visível a usuários autenticados; rascunhos só para equipe.
drop policy if exists content_categories_read on public.content_categories;
create policy content_categories_read on public.content_categories for select to authenticated
using (ativo = true or public.current_user_can_edit_content());

drop policy if exists content_categories_admin_manage on public.content_categories;
create policy content_categories_admin_manage on public.content_categories for all to authenticated
using (public.current_user_can_edit_content()) with check (public.current_user_can_edit_content());

drop policy if exists library_contents_read_published on public.library_contents;
create policy library_contents_read_published on public.library_contents for select to authenticated
using (status = 'publicado' or public.current_user_can_edit_content());

drop policy if exists library_contents_editor_manage on public.library_contents;
create policy library_contents_editor_manage on public.library_contents for all to authenticated
using (public.current_user_can_edit_content()) with check (public.current_user_can_edit_content());

drop policy if exists content_favorites_own on public.content_favorites;
create policy content_favorites_own on public.content_favorites for all to authenticated
using (user_id = (select auth.uid()) and public.current_user_is_active())
with check (user_id = (select auth.uid()) and public.current_user_is_active());

-- Formulário fale conosco pode ser enviado por visitante (anon/authenticated).
drop policy if exists support_ticket_submit on public.support_tickets;
create policy support_ticket_submit on public.support_tickets for insert to anon, authenticated
with check (
  (auth.uid() is null and user_id is null)
  or (auth.uid() is not null and user_id = (select auth.uid()))
);

drop policy if exists support_ticket_read_own_or_staff on public.support_tickets;
create policy support_ticket_read_own_or_staff on public.support_tickets for select to authenticated
using (user_id = (select auth.uid()) or public.current_user_has_admin_access());

drop policy if exists support_ticket_staff_update on public.support_tickets;
create policy support_ticket_staff_update on public.support_tickets for update to authenticated
using (public.current_user_has_admin_access()) with check (public.current_user_has_admin_access());

drop policy if exists problem_reports_own_insert on public.problem_reports;
create policy problem_reports_own_insert on public.problem_reports for insert to authenticated
with check (user_id = (select auth.uid()) and public.current_user_is_active());

drop policy if exists problem_reports_read_own_or_staff on public.problem_reports;
create policy problem_reports_read_own_or_staff on public.problem_reports for select to authenticated
using (user_id = (select auth.uid()) or public.current_user_has_admin_access());

drop policy if exists problem_reports_staff_update on public.problem_reports;
create policy problem_reports_staff_update on public.problem_reports for update to authenticated
using (public.current_user_has_admin_access()) with check (public.current_user_has_admin_access());

drop policy if exists suggestions_own_insert on public.user_suggestions;
create policy suggestions_own_insert on public.user_suggestions for insert to authenticated
with check (user_id = (select auth.uid()) and public.current_user_is_active());

drop policy if exists suggestions_read_own_or_staff on public.user_suggestions;
create policy suggestions_read_own_or_staff on public.user_suggestions for select to authenticated
using (user_id = (select auth.uid()) or public.current_user_has_admin_access());

drop policy if exists suggestions_staff_update on public.user_suggestions;
create policy suggestions_staff_update on public.user_suggestions for update to authenticated
using (public.current_user_has_admin_access()) with check (public.current_user_has_admin_access());

-- Planos públicos para leitura; alterações só por administrador.
drop policy if exists plans_read_active on public.subscription_plans;
create policy plans_read_active on public.subscription_plans for select to authenticated
using (status = 'ativo' or public.current_user_is_admin());

drop policy if exists plans_admin_manage on public.subscription_plans;
create policy plans_admin_manage on public.subscription_plans for all to authenticated
using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists subscriptions_own_read on public.user_subscriptions;
create policy subscriptions_own_read on public.user_subscriptions for select to authenticated
using (user_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists subscriptions_admin_manage on public.user_subscriptions;
create policy subscriptions_admin_manage on public.user_subscriptions for all to authenticated
using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists payments_own_read on public.payment_records;
create policy payments_own_read on public.payment_records for select to authenticated
using (user_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists payments_admin_manage on public.payment_records;
create policy payments_admin_manage on public.payment_records for all to authenticated
using (public.current_user_is_admin()) with check (public.current_user_is_admin());

-- Campanhas são administradas pela equipe; notificações individuais são privadas.
drop policy if exists campaigns_staff_read on public.notification_campaigns;
create policy campaigns_staff_read on public.notification_campaigns for select to authenticated
using (public.current_user_has_admin_access());

drop policy if exists campaigns_admin_manage on public.notification_campaigns;
create policy campaigns_admin_manage on public.notification_campaigns for all to authenticated
using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists user_notifications_own_read on public.user_notifications;
create policy user_notifications_own_read on public.user_notifications for select to authenticated
using (user_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists user_notifications_own_update on public.user_notifications;
create policy user_notifications_own_update on public.user_notifications for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists user_notifications_admin_insert on public.user_notifications;
create policy user_notifications_admin_insert on public.user_notifications for insert to authenticated
with check (public.current_user_is_admin());

drop policy if exists settings_read_staff on public.app_settings;
create policy settings_read_staff on public.app_settings for select to authenticated
using (public.current_user_has_admin_access());

drop policy if exists settings_admin_manage on public.app_settings;
create policy settings_admin_manage on public.app_settings for all to authenticated
using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists audit_logs_admin_read on public.admin_audit_logs;
create policy audit_logs_admin_read on public.admin_audit_logs for select to authenticated
using (public.current_user_is_admin());

drop policy if exists audit_logs_admin_insert on public.admin_audit_logs;
create policy audit_logs_admin_insert on public.admin_audit_logs for insert to authenticated
with check (public.current_user_is_admin() and admin_id = (select auth.uid()));

-- Categorias padrão da biblioteca
insert into public.content_categories (nome, slug, descricao, ordem)
values
  ('Vida em Casa', 'vida-em-casa', 'Organização e atividades do dia a dia em casa.', 1),
  ('Finanças', 'financas', 'Organização financeira e controle de gastos.', 2),
  ('Trabalho e Carreira', 'trabalho-carreira', 'Preparação para trabalho e carreira.', 3),
  ('Vida Independente', 'vida-independente', 'Autonomia e atividades fora de casa.', 4),
  ('Cozinha e Alimentação', 'cozinha-alimentacao', 'Receitas e organização da alimentação.', 5)
on conflict (slug) do nothing;

-- Planos iniciais. Ajuste os preços/benefícios antes de vender qualquer assinatura.
insert into public.subscription_plans (codigo, nome, descricao, preco_mensal, preco_anual, recursos, ordem)
values
  ('gratuito', 'Gratuito', 'Recursos essenciais de organização.', 0, 0,
   '["Tarefas", "Agenda", "Metas básicas", "Biblioteca"]'::jsonb, 1),
  ('premium', 'Premium', 'Recursos adicionais do NeuroConecta.', 0, 0,
   '["Recursos Premium", "Estatísticas avançadas", "Experiência sem anúncios"]'::jsonb, 2)
on conflict (codigo) do nothing;

-- Permissões SQL; as políticas RLS acima continuam limitando quais linhas cada papel pode acessar.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on
  public.profiles, public.user_preferences, public.tasks, public.agenda_events,
  public.goals, public.achievements, public.user_achievements,
  public.finance_settings, public.finance_categories, public.finance_transactions,
  public.content_categories, public.library_contents, public.content_favorites,
  public.support_tickets, public.problem_reports, public.user_suggestions,
  public.subscription_plans, public.user_subscriptions, public.payment_records,
  public.notification_campaigns, public.user_notifications, public.app_settings,
  public.admin_audit_logs
to authenticated;
grant insert on public.support_tickets to anon;
grant usage, select on all sequences in schema public to authenticated;

-- ============================================================
-- NEUROCONECTA | COMPLEMENTO DEFINITIVO DE REGRAS DE NEGOCIO
-- Inclui limites Free/Premium, subtarefas, etapas, lembretes,
-- orçamento, biblioteca exclusiva Premium e preços escolhidos.
-- ============================================================

-- Verifica a assinatura Premium ativa do usuário autenticado.
create or replace function public.current_user_has_premium()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_subscriptions us
    join public.subscription_plans sp on sp.id = us.plan_id
    where us.user_id = (select auth.uid())
      and sp.codigo = 'premium'
      and us.status = 'ativa'
      and (us.inicio_em is null or us.inicio_em <= now())
      and (us.fim_em is null or us.fim_em > now())
  );
$$;

-- Campos extras de preferências para personalização Premium.
alter table public.user_preferences
  add column if not exists icone_app text,
  add column if not exists organizacao_layout text not null default 'padrao'
    check (organizacao_layout in ('padrao', 'compacto', 'visual')),
  add column if not exists cor_destaque text;

-- A biblioteca terá categorias, capas e vídeos/links adicionados futuramente.
alter table public.content_categories
  add column if not exists icone text,
  add column if not exists imagem_url text,
  add column if not exists premium_required boolean not null default true;

alter table public.library_contents
  add column if not exists premium_required boolean not null default true,
  add column if not exists storage_path text,
  add column if not exists duracao_segundos integer check (duracao_segundos is null or duracao_segundos >= 0),
  add column if not exists ordem integer not null default 0;

-- Subtarefas: somente Premium. A tarefa principal continua em public.tasks.
create table if not exists public.task_subtasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  titulo text not null,
  descricao text not null default '',
  concluida boolean not null default false,
  ordem integer not null default 0,
  concluida_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint task_subtasks_title_not_empty check (length(trim(titulo)) > 0)
);

-- Etapas de metas: somente Premium.
create table if not exists public.goal_steps (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  titulo text not null,
  descricao text not null default '',
  concluida boolean not null default false,
  ordem integer not null default 0,
  concluida_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint goal_steps_title_not_empty check (length(trim(titulo)) > 0)
);

-- Lembretes personalizados e recorrentes Premium. Lembretes básicos
-- de uma tarefa podem continuar usando tasks.lembrete/lembrete_em.
create table if not exists public.custom_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete cascade,
  agenda_event_id uuid references public.agenda_events(id) on delete cascade,
  titulo text not null,
  mensagem text not null default '',
  lembrar_em timestamptz not null,
  regra_repeticao text,
  fuso_horario text not null default 'America/Sao_Paulo',
  canais jsonb not null default '["push"]'::jsonb,
  ativo boolean not null default true,
  ultima_execucao_em timestamptz,
  proxima_execucao_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint custom_reminder_target_check check (
    (case when task_id is null then 0 else 1 end) +
    (case when goal_id is null then 0 else 1 end) +
    (case when agenda_event_id is null then 0 else 1 end) = 1
  ),
  constraint custom_reminder_title_not_empty check (length(trim(titulo)) > 0),
  constraint custom_reminder_channels_array check (jsonb_typeof(canais) = 'array')
);

-- Orçamentos mensais Premium.
create table if not exists public.finance_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.finance_categories(id) on delete set null,
  nome text not null,
  valor_limite numeric(12,2) not null check (valor_limite >= 0),
  mes date not null,
  observacoes text not null default '',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint finance_budgets_month_start check (extract(day from mes) = 1),
  constraint finance_budgets_name_not_empty check (length(trim(nome)) > 0)
);

-- Limites Free: até 5 tarefas principais ativas e até 3 metas ativas/pausadas.
-- Tarefas concluídas/canceladas não contam no limite ativo.
create or replace function public.enforce_task_plan_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare active_count integer;
begin
  if new.status not in ('concluida', 'cancelada')
     and not public.current_user_has_premium_for(new.user_id) then
    select count(*) into active_count
    from public.tasks t
    where t.user_id = new.user_id
      and t.status not in ('concluida', 'cancelada')
      and t.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid);
    if active_count >= 5 then
      raise exception 'O plano gratuito permite até 5 tarefas ativas. Assine o Premium para criar tarefas ilimitadas.'
        using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.current_user_has_premium_for(p_user_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_subscriptions us
    join public.subscription_plans sp on sp.id = us.plan_id
    where us.user_id = p_user_id
      and sp.codigo = 'premium'
      and us.status = 'ativa'
      and (us.inicio_em is null or us.inicio_em <= now())
      and (us.fim_em is null or us.fim_em > now())
  );
$$;

create or replace function public.enforce_goal_plan_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare active_count integer;
begin
  if new.status in ('ativa', 'pausada')
     and not public.current_user_has_premium_for(new.user_id) then
    select count(*) into active_count
    from public.goals g
    where g.user_id = new.user_id
      and g.status in ('ativa', 'pausada')
      and g.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid);
    if active_count >= 3 then
      raise exception 'O plano gratuito permite até 3 metas ativas. Assine o Premium para criar metas ilimitadas.'
        using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists tasks_plan_limit on public.tasks;
create trigger tasks_plan_limit before insert or update on public.tasks
for each row execute procedure public.enforce_task_plan_limit();

drop trigger if exists goals_plan_limit on public.goals;
create trigger goals_plan_limit before insert or update on public.goals
for each row execute procedure public.enforce_goal_plan_limit();

-- Exige Premium para recursos exclusivos e valida que a tarefa/meta/evento
-- associado pertence ao mesmo usuário.
create or replace function public.enforce_premium_child_resource()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.current_user_has_premium_for(new.user_id) then
    raise exception 'Este recurso está disponível somente no plano Premium.' using errcode = 'P0001';
  end if;
  if tg_table_name = 'task_subtasks' and not exists (
    select 1 from public.tasks t where t.id = new.task_id and t.user_id = new.user_id
  ) then
    raise exception 'A tarefa informada não pertence a este usuário.' using errcode = '23503';
  end if;
  if tg_table_name = 'goal_steps' and not exists (
    select 1 from public.goals g where g.id = new.goal_id and g.user_id = new.user_id
  ) then
    raise exception 'A meta informada não pertence a este usuário.' using errcode = '23503';
  end if;
  if tg_table_name = 'custom_reminders' and (
    (new.task_id is not null and not exists (select 1 from public.tasks t where t.id = new.task_id and t.user_id = new.user_id)) or
    (new.goal_id is not null and not exists (select 1 from public.goals g where g.id = new.goal_id and g.user_id = new.user_id)) or
    (new.agenda_event_id is not null and not exists (select 1 from public.agenda_events a where a.id = new.agenda_event_id and a.user_id = new.user_id))
  ) then
    raise exception 'O item associado ao lembrete não pertence a este usuário.' using errcode = '23503';
  end if;
  return new;
end;
$$;

drop trigger if exists task_subtasks_premium_check on public.task_subtasks;
create trigger task_subtasks_premium_check before insert or update on public.task_subtasks
for each row execute procedure public.enforce_premium_child_resource();
drop trigger if exists goal_steps_premium_check on public.goal_steps;
create trigger goal_steps_premium_check before insert or update on public.goal_steps
for each row execute procedure public.enforce_premium_child_resource();
drop trigger if exists custom_reminders_premium_check on public.custom_reminders;
create trigger custom_reminders_premium_check before insert or update on public.custom_reminders
for each row execute procedure public.enforce_premium_child_resource();
drop trigger if exists finance_budgets_premium_check on public.finance_budgets;
create trigger finance_budgets_premium_check before insert or update on public.finance_budgets
for each row execute procedure public.enforce_premium_child_resource();

-- Biblioteca e conteúdos são exclusivos do Premium. Administradores podem
-- visualizar rascunhos e gerenciar todo o catálogo.
drop policy if exists content_categories_read on public.content_categories;
drop policy if exists library_contents_read_published on public.library_contents;
create policy content_categories_read on public.content_categories for select to authenticated
using ((ativo = true and public.current_user_has_premium()) or public.current_user_can_edit_content());
create policy library_contents_read_published on public.library_contents for select to authenticated
using ((status = 'publicado' and public.current_user_has_premium())
       or public.current_user_can_edit_content());

-- O usuário só vê seus próprios dados e só pode acessar as novas tabelas
-- quando autenticado. Os triggers acima validam a assinatura Premium.
alter table public.task_subtasks enable row level security;
alter table public.goal_steps enable row level security;
alter table public.custom_reminders enable row level security;
alter table public.finance_budgets enable row level security;

drop policy if exists task_subtasks_own on public.task_subtasks;
create policy task_subtasks_own on public.task_subtasks for all to authenticated
using (user_id = (select auth.uid()) and public.current_user_is_active())
with check (user_id = (select auth.uid()) and public.current_user_is_active());
drop policy if exists goal_steps_own on public.goal_steps;
create policy goal_steps_own on public.goal_steps for all to authenticated
using (user_id = (select auth.uid()) and public.current_user_is_active())
with check (user_id = (select auth.uid()) and public.current_user_is_active());
drop policy if exists custom_reminders_own on public.custom_reminders;
create policy custom_reminders_own on public.custom_reminders for all to authenticated
using (user_id = (select auth.uid()) and public.current_user_is_active())
with check (user_id = (select auth.uid()) and public.current_user_is_active());
drop policy if exists finance_budgets_own on public.finance_budgets;
create policy finance_budgets_own on public.finance_budgets for all to authenticated
using (user_id = (select auth.uid()) and public.current_user_is_active())
with check (user_id = (select auth.uid()) and public.current_user_is_active());

-- Campos de auditoria automática nas novas tabelas.
do $$
declare t text;
begin
  foreach t in array array['task_subtasks','goal_steps','custom_reminders','finance_budgets'] loop
    execute format('drop trigger if exists set_atualizado_em on public.%I', t);
    execute format('create trigger set_atualizado_em before update on public.%I for each row execute procedure public.set_atualizado_em()', t);
  end loop;
end $$;

create index if not exists idx_task_subtasks_task_order on public.task_subtasks(task_id, ordem);
create index if not exists idx_goal_steps_goal_order on public.goal_steps(goal_id, ordem);
create index if not exists idx_custom_reminders_user_next on public.custom_reminders(user_id, ativo, proxima_execucao_em);
create index if not exists idx_finance_budgets_user_month on public.finance_budgets(user_id, mes);
create index if not exists idx_library_premium_status on public.library_contents(premium_required, status, category_id, ordem);

-- Atualiza os planos com os preços e benefícios definidos pelo projeto.
insert into public.subscription_plans (codigo, nome, descricao, preco_mensal, preco_anual, recursos, status, ordem)
values
  ('gratuito', 'Gratuito', 'Organização essencial com limites de uso.', 0, 0,
   '["Até 5 tarefas ativas","Até 3 metas ativas","Relatórios mensais","Finanças básicas","Sem acesso à biblioteca"]'::jsonb, 'ativo', 1),
  ('premium', 'Premium', 'Acesso completo às ferramentas avançadas do NeuroConecta.', 19.99, 299.00,
   '["Tarefas ilimitadas e subtarefas","Lembretes ilimitados e personalizados","Metas ilimitadas e etapas","Finanças avançadas, gráficos, orçamento e histórico","Biblioteca completa de vídeos","Relatórios por dia, semana, mês, ano ou período","Personalização de tema, ícones e organização","Suporte prioritário"]'::jsonb, 'ativo', 2)
on conflict (codigo) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  preco_mensal = excluded.preco_mensal,
  preco_anual = excluded.preco_anual,
  recursos = excluded.recursos,
  status = excluded.status,
  ordem = excluded.ordem;

-- Exemplos de categorias. Nenhum vídeo real é inserido: os links e imagens
-- ficam vazios até o responsável adicionar o material definitivo.
insert into public.content_categories (nome, slug, descricao, ordem, icone, premium_required)
values
  ('Vida em Casa', 'vida-em-casa', 'Organização e atividades do dia a dia em casa.', 1, 'home', true),
  ('Finanças', 'financas', 'Organização financeira e controle de gastos.', 2, 'wallet', true),
  ('Trabalho e Carreira', 'trabalho-carreira', 'Preparação para trabalho e carreira.', 3, 'briefcase', true),
  ('Vida Independente', 'vida-independente', 'Autonomia e atividades fora de casa.', 4, 'compass', true),
  ('Cozinha e Alimentação', 'cozinha-alimentacao', 'Receitas e organização da alimentação.', 5, 'utensils', true)
on conflict (slug) do update set
  descricao = excluded.descricao,
  ordem = excluded.ordem,
  icone = excluded.icone,
  premium_required = excluded.premium_required;

-- Chamados de usuários Premium recebem prioridade alta no registro.
-- Isso sinaliza prioridade no painel, mas não promete um prazo de resposta.
create or replace function public.set_support_priority_by_plan()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.user_id is not null and public.current_user_has_premium_for(new.user_id) then
    new.prioridade := 'alta';
  end if;
  return new;
end;
$$;
drop trigger if exists support_priority_by_plan on public.support_tickets;
create trigger support_priority_by_plan before insert on public.support_tickets
for each row execute procedure public.set_support_priority_by_plan();

-- Campos que serão preenchidos depois em library_contents:
-- titulo, resumo, conteudo, url_externa (link do vídeo), imagem_url (capa),
-- storage_path (arquivo no Supabase Storage), duracao_segundos e category_id.
-- Os conteúdos novos começam como 'rascunho' e só aparecem quando publicados.

-- Permissões das novas tabelas.
grant select, insert, update, delete on
  public.task_subtasks, public.goal_steps, public.custom_reminders, public.finance_budgets
  to authenticated;
revoke all on function public.current_user_has_premium_for(uuid) from public, anon, authenticated;
revoke all on function public.current_user_has_premium() from public, anon;
grant execute on function public.current_user_has_premium() to authenticated;


-- ============================================================
-- COMPLEMENTO CONSOLIDADO DE COMPATIBILIDADE E CONTAS ADMIN
-- Este bloco substitui a antiga migracao_compatibilidade_frontend.sql.
-- E ADITIVO: nao apaga usuarios, senhas, videos, links, categorias,
-- favoritos, assinaturas, registros financeiros ou qualquer tabela.
-- ============================================================

alter table public.profiles
  add column if not exists nome_usuario text,
  add column if not exists telefone text;

-- Mantem o trigger de novos cadastros compativel com o aplicativo.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nome_completo, email, data_nascimento)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'nome_completo'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Usuario'
    ),
    new.email,
    case
      when coalesce(new.raw_user_meta_data ->> 'data_nascimento', '') ~ '^\d{4}-\d{2}-\d{2}$'
      then (new.raw_user_meta_data ->> 'data_nascimento')::date
      else null
    end
  )
  on conflict (id) do update
    set email = excluded.email,
        data_nascimento = coalesce(excluded.data_nascimento, public.profiles.data_nascimento);
  return new;
end;
$$;

-- Sincroniza o e-mail do perfil depois de uma alteracao confirmada no Auth.
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = new.email where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
after update of email on auth.users
for each row execute procedure public.sync_profile_email();

-- Repara perfis ausentes para contas que JA existem no Auth.
-- Nao cria contas, nao redefine senhas e nao altera UIDs existentes.
insert into public.profiles (id, nome_completo, email, data_nascimento)
select
  u.id,
  coalesce(
    nullif(trim(u.raw_user_meta_data ->> 'nome_completo'), ''),
    nullif(trim(u.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(coalesce(u.email, ''), '@', 1), ''),
    'Usuario'
  ),
  u.email,
  case
    when coalesce(u.raw_user_meta_data ->> 'data_nascimento', '') ~ '^\d{4}-\d{2}-\d{2}$'
    then (u.raw_user_meta_data ->> 'data_nascimento')::date
    else null
  end
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- Garante que os e-mails atuais do Auth estejam refletidos nos perfis existentes.
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id
  and p.email is distinct from u.email;

-- Atualiza apenas os perfis das quatro contas indicadas pelo projeto.
-- As contas precisam existir em Authentication > Users antes desta etapa.
update public.profiles p
set role = 'administrador',
    ativo = true,
    nome_completo = case lower(p.email)
      when 'kalilbastosdasilva@gmail.com' then 'Kalil Bastos'
      when 'laisenribeiro@gmail.com' then 'Laíse Nátali'
      when 'lcostatobias1@gmail.com' then 'Lucas Costa'
      when 'sgabriellykauane@gmail.com' then 'Gaby Kauane'
      else p.nome_completo
    end
where lower(coalesce(p.email, '')) in (
  'kalilbastosdasilva@gmail.com',
  'laisenribeiro@gmail.com',
  'lcostatobias1@gmail.com',
  'sgabriellykauane@gmail.com'
)
and exists (select 1 from auth.users u where u.id = p.id);

-- Diagnostico: mostra se cada conta tem Auth, perfil e papel de administrador.
-- Nao mostra hash, senha nem token.
select
  u.email,
  u.id as uid,
  case when u.encrypted_password is not null and u.encrypted_password <> ''
       then 'Senha local cadastrada' else 'Sem senha local (pode usar provedor externo)' end as credencial,
  case when p.id is not null then 'Perfil existente' else 'Perfil ausente' end as perfil,
  coalesce(p.role::text, 'sem perfil') as permissao,
  coalesce(p.ativo, false) as conta_ativa
from auth.users u
left join public.profiles p on p.id = u.id
where lower(coalesce(u.email, '')) in (
  'kalilbastosdasilva@gmail.com',
  'laisenribeiro@gmail.com',
  'lcostatobias1@gmail.com',
  'sgabriellykauane@gmail.com'
)
order by u.email;

-- Importante: a senha continua exclusivamente no Supabase Auth (auth.users).
-- Nunca crie coluna senha em public.profiles e nunca armazene senha em texto puro.
